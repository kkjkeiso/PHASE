import express from "express";
import session from "express-session";
import cors from "cors";
import db from "./db";
import { hashPassword, verifyPassword } from "./auth";

const app = express();
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

app.use(session({
    secret: "troca_esse_secret_por_env",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }, // 24h
}));

// Registro
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ error: "Campos obrigatórios faltando." });

    try {
        const stmt = db.prepare(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"
        );
        stmt.run(username, email, hashPassword(password));
        res.status(201).json({ message: "Usuário criado com sucesso." });
    } catch (e: any) {
        if (e.message.includes("UNIQUE"))
            return res.status(409).json({ error: "Email já cadastrado." });
        res.status(500).json({ error: "Erro interno." });
    }
});

// Verificar email (etapa 1 do login)
app.post("/check-email", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Informe o email." });

    const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (!user) return res.status(404).json({ error: "Email não encontrado." });

    res.json({ ok: true });
});

// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Campos obrigatórios faltando." });

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) return res.status(404).json({ error: "Email não encontrado." });
    if (!verifyPassword(password, user.password_hash))
        return res.status(401).json({ error: "Senha incorreta." });

    (req.session as any).userId = user.id;
    res.json({ message: "Login realizado", user: { id: user.id, username: user.username } });
});

// Logout
app.post("/logout", (req, res) => {
    req.session.destroy(() => res.json({ message: "Logout realizado." }));
});

// Rota protegida
app.get("/me", (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ error: "Não autenticado." });

    const user = db.prepare("SELECT id, username, email FROM users WHERE id = ?").get(userId);
    res.json(user);
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
