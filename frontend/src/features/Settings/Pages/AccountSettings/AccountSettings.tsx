import { useEffect, useMemo, useRef, useState, type JSX, type ReactNode } from "react";
import useIsMobile from "../../../../components/layouts/UseIsMobile";
import authClient from "../../../../lib/auth-clients";

type EmailItem = {
    id: string;
    address: string;
    verified: boolean;
    primary: boolean;
};

type SessionItem = {
    id: string;
    device: string;
    location: string;
    lastActive: string;
    current: boolean;
};

type BannerState = {
    type: "" | "success" | "error" | "info";
    message: string;
};

type PillTone = "neutral" | "success" | "warn";

type SectionProps = {
    title: string;
    subtitle?: string;
    children: ReactNode;
    right?: ReactNode;
};

type RowProps = {
    label: string;
    children: ReactNode;
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
};

type ButtonVariant = "solid" | "ghost" | "danger";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    className?: string;
};

type PillProps = {
    children: ReactNode;
    tone?: PillTone;
};

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function maskEmail(email: string): string {
    const e = String(email || "");
    const [name, domain] = e.split("@");
    if (!domain) return e;
    if (name.length <= 2) return `${name[0] ?? ""}***@${domain}`;
    return `${name.slice(0, 2)}***@${domain}`;
}

function uid(): string {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function Input({ className = "", ...props }: InputProps): JSX.Element {
    return (
        <input
            {...props}
            className={[
                "w-full bg-[#2C474B] rounded-xl outline-none",
                "h-12 px-4",
                "focus:ring-2 focus:ring-white/20",
                className,
            ].join(" ")}
        />
    );
}

function Section({
    title,
    subtitle,
    children,
    right,
    isMobile,
}: SectionProps & { isMobile: boolean }): JSX.Element {
    return (
        <div className="border-b border-[#2a3f42] py-6">
            <div className={`w-full ${isMobile ? "flex flex-col gap-2" : "flex items-start justify-between gap-6"}`}>
                <div className="min-w-0">
                    <p className="text-lg font-semibold">{title}</p>
                    {subtitle ? <p className="text-sm opacity-80 mt-1">{subtitle}</p> : null}
                </div>
                {right ? <div className={`${isMobile ? "" : "shrink-0"}`}>{right}</div> : null}
            </div>
            <div className="mt-5">{children}</div>
        </div>
    );
}

function Row({ label, children, isMobile }: RowProps & { isMobile: boolean }): JSX.Element {
    return (
        <div className={`w-full ${isMobile ? "flex flex-col gap-2" : "flex items-center gap-6"}`}>
            <p className={`${isMobile ? "w-full" : "w-60"} font-semibold`}>{label}</p>
            <div className="w-full min-w-0">{children}</div>
        </div>
    );
}

function Button({ variant = "solid", className = "", ...props }: ButtonProps): JSX.Element {
    const base =
        "inline-flex items-center justify-center rounded-xl transition select-none disabled:opacity-50 disabled:cursor-not-allowed";
    const solid = "bg-[#2C474B] hover:bg-white hover:text-black";
    const ghost = "bg-transparent hover:bg-white/10 ";
    const danger = "bg-transparent hover:bg-[#FFB856]/15  text-[#FFB856]";
    const styles = variant === "ghost" ? ghost : variant === "danger" ? danger : solid;

    return <button {...props} className={[base, styles, "h-11 px-4", className].join(" ")} />;
}

function Pill({ children, tone = "neutral" }: PillProps): JSX.Element {
    const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
    const neutral = "bg-[#FFB856] text-[#115E66]";
    const success = "bg-primary text-[#2C474B] ";
    const warn = "bg-[#FFB856] text-[#115E66]";
    const styles = tone === "success" ? success : tone === "warn" ? warn : neutral;
    return <span className={[base, styles].join(" ")}>{children}</span>;
}

function Banner({ banner }: { banner: BannerState }): JSX.Element | null {
    if (!banner.message) return null;

    const tone =
        banner.type === "success"
            ? "border-primary/25 bg-primary/98 text-[#2C474B] font-semibold"
            : banner.type === "error"
                ? "border-red-400/25 bg-red-400 text-red-100"
                : "border-white/10 bg-white/5 text-white/90";

    return (
        <div className={`mb-5 rounded-2xl border px-4 py-3 ${tone}`}>
            <p className="text-sm">{banner.message}</p>
        </div>
    );
}

export default function AccountSettings(): JSX.Element {
    const isMobile = useIsMobile();

    const { data: session } = authClient.useSession();
    const didInitRef = useRef(false);

    const [emails, setEmails] = useState<EmailItem[]>([]);

    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPw, setShowPw] = useState<boolean>(false);

    const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(false);

    const [sessions, setSessions] = useState<SessionItem[]>([
        { id: "s1", device: "Chrome • Windows", location: "France", lastActive: "Actif maintenant", current: true },
        { id: "s2", device: "iPhone • Safari", location: "France", lastActive: "Il y a 2 jours", current: false },
    ]);

    const [banner, setBanner] = useState<BannerState>({ type: "", message: "" });

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const initialSnapshotRef = useRef<string | null>(null);

    useEffect(() => {
        if (!session?.user || didInitRef.current) return;

        didInitRef.current = true;

        const email = session.user.email ?? "";

        const nextEmails: EmailItem[] = [
            {
                id: "primary",
                address: email,
                verified: Boolean((session.user as any).emailVerified),
                primary: true,
            },
        ];

        setEmails(nextEmails);

        // si tu ne stockes pas 2FA dans user, laisse false
        const next2FA = Boolean((session.user as any).twoFactorEnabled ?? false);
        setTwoFAEnabled(next2FA);

        initialSnapshotRef.current = JSON.stringify({ emails: nextEmails, twoFAEnabled: next2FA });
    }, [session]);


    const isDirtyAccount = useMemo<boolean>(() => {
        if (!initialSnapshotRef.current) return false;
        const now = JSON.stringify({ emails, twoFAEnabled });
        return now !== initialSnapshotRef.current;
    }, [emails, twoFAEnabled]);

    const isDirtyPassword = useMemo<boolean>(() => {
        return Boolean(currentPassword || newPassword || confirmPassword);
    }, [currentPassword, newPassword, confirmPassword]);


    const primaryEmail = useMemo<EmailItem>(() => {
        const found = emails.find((e) => e.primary);
        if (found) return found;

        return { id: "primary", address: "", verified: false, primary: true };
    }, [emails]);


    const secondaryEmails = useMemo<EmailItem[]>(
        () => emails.filter((e) => !e.primary),
        [emails]
    );

    const emailErrors = useMemo<Record<string, string>>(() => {
        const errs: Record<string, string> = {};
        const normalized = emails.map((e) => e.address.trim().toLowerCase());

        emails.forEach((e, idx) => {
            const val = e.address.trim();
            if (!val) errs[e.id] = "Adresse requise.";
            else if (!isValidEmail(val)) errs[e.id] = "Adresse invalide.";
            else if (normalized.indexOf(val.toLowerCase()) !== idx) errs[e.id] = "Adresse déjà utilisée.";
        });

        return errs;
    }, [emails]);

    const passwordError = useMemo<string>(() => {
        if (!currentPassword && !newPassword && !confirmPassword) return "";
        if (!currentPassword) return "Mot de passe actuel requis.";
        if (!newPassword) return "Nouveau mot de passe requis.";
        if (newPassword.length < 8) return "Le nouveau mot de passe doit faire au moins 8 caractères.";
        if (confirmPassword !== newPassword) return "La confirmation ne correspond pas.";
        return "";
    }, [currentPassword, newPassword, confirmPassword]);

    const canSave = useMemo<boolean>(() => {
        const hasEmailErrors = Object.keys(emailErrors).length > 0;
        const hasPasswordError = Boolean(passwordError);
        return (isDirtyAccount || isDirtyPassword) && !hasEmailErrors && !hasPasswordError && !isSaving;
    }, [isDirtyAccount, isDirtyPassword, emailErrors, passwordError, isSaving]);


    const setPrimary = (id: string): void => {
        setEmails((prev) =>
            prev.map((e) => ({
                ...e,
                primary: e.id === id,
            }))
        );
        setBanner({ type: "info", message: "Email principal mis à jour (non sauvegardé)." });
    };

    const updateEmail = (id: string, value: string): void => {
        setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, address: value } : e)));
    };

    const addSecondaryEmail = (): void => {
        setEmails((prev) => [...prev, { id: uid(), address: "", verified: false, primary: false }]);
    };

    const removeEmail = (id: string): void => {
        setEmails((prev) => {
            const target = prev.find((e) => e.id === id);
            if (!target) return prev;
            if (target.primary) return prev;
            return prev.filter((e) => e.id !== id);
        });
    };

    const resendVerification = async (): Promise<void> => {
        try {
            setBanner({ type: "info", message: "Envoi de l'email de vérification..." });

            const BACK_URL = import.meta.env.VITE_BACK_URL || "http://localhost:3005";

            const res = await fetch(`${BACK_URL}/api/auth/send-verification-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: primaryEmail.address }),
            });

            const raw = await res.text();
            let data: any = null;
            try { data = JSON.parse(raw); } catch { /* pas du JSON */ }

            if (!res.ok) {
                console.error("send-verification-email failed:", res.status, raw);
                throw new Error(data?.message || raw || `HTTP ${res.status}`);
            }

            setBanner({
                type: "success",
                message: `Email de vérification envoyé à ${maskEmail(primaryEmail.address)}.`,
            });
        } catch (error: any) {
            setBanner({
                type: "error",
                message: error?.message || "Erreur lors de l'envoi.",
            });
        }
    };



    const signOutSession = (id: string): void => {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        setBanner({ type: "success", message: "Session déconnectée." });
    };

    const signOutAll = (): void => {
        setSessions((prev) => prev.filter((s) => s.current));
        setBanner({ type: "success", message: "Toutes les autres sessions ont été déconnectées." });
    };

    // Changer le mot de passe 
    const handleSave = async (): Promise<void> => {
        if (!canSave) return;
        setIsSaving(true);
        setBanner({ type: "info", message: "Enregistrement..." });

        try {

            const wantsPwChange = Boolean(currentPassword || newPassword || confirmPassword);

            if (wantsPwChange) {
                if (passwordError) throw new Error(passwordError);

                // Sois via authClient si dispo
                if (typeof (authClient as any).changePassword === "function") {
                    try {
                        const r = await (authClient as any).changePassword({
                            currentPassword,
                            newPassword,
                            revokeOtherSessions: true,
                        });

                        // si la lib renvoie un objet error
                        if (r?.error) {
                            throw new Error(r.error?.message || "Mot de passe actuel incorrect.");
                        }
                    } catch (e: any) {
                        // si la lib throw directement
                        throw new Error(e?.message?.toLowerCase?.().includes("password")
                            ? "Mot de passe actuel incorrect."
                            : "Impossible de changer le mot de passe."
                        );
                    }

                } else {
                    // sois appel direct endpoint Better Auth
                    const BACK_URL = import.meta.env.VITE_BACK_URL || "http://localhost:3005";

                    const res = await fetch(`${BACK_URL}/api/auth/change-password`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            currentPassword,
                            newPassword,
                            revokeOtherSessions: true,
                        }),
                    });

                    const raw = await res.text();
                    let data: any = null;
                    try { data = JSON.parse(raw); } catch { }

                    if (!res.ok) {
                        if (res.status === 401 || res.status === 400) {
                            throw new Error("Mot de passe actuel incorrect.");
                        }
                        throw new Error(data?.message || raw || `HTTP ${res.status}`);
                    }
                }
            }

            // reset
            initialSnapshotRef.current = JSON.stringify({ emails, twoFAEnabled });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setBanner({ type: "success", message: "Modifications enregistrées." });
        } catch (error: any) {
            setBanner({ type: "error", message: error?.message || "Erreur lors de l'enregistrement." });
        } finally {
            setIsSaving(false);
        }
    };

    const [bannerPosition, setBannerPosition] = useState("top")

    const handleToggle2FA = async () => {
        try {
            const password =
                currentPassword || prompt("Entrez votre mot de passe pour gérer la 2FA :") || "";

            if (!password) {
                setBanner({ type: "error", message: "Mot de passe requis pour la 2FA." });
                return;
            }

            setIsSaving(true);
            setBanner({ type: "info", message: "Mise à jour 2FA..." });

            if (!twoFAEnabled) {
                // activer
                const { error } = await (authClient as any).twoFactor.enable({
                    password,
                    issuer: "Horizons+",
                });

                if (error) throw new Error(error.message);
                setTwoFAEnabled(true);
                setBanner({ type: "success", message: "2FA activée." });
            }
            else {
                // désactiver
                const { error } = await (authClient as any).twoFactor.disable({ password });

                if (error) throw new Error(error.message);

                setTwoFAEnabled(false);
                setBanner({ type: "success", message: "2FA désactivée." });
            }

            // snapshot à jour
            initialSnapshotRef.current = JSON.stringify({ emails, twoFAEnabled: !twoFAEnabled });
        }
        catch (e: any) {
            setBanner({ type: "error", message: e?.message || "Erreur 2FA." });
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <div className="w-full">
            <div className="px-2 py-5">
                {bannerPosition === "top" && <Banner banner={banner} />}

                <Section
                    isMobile={isMobile}
                    title="Adresse mail"
                    subtitle="Gérez votre email principal et vos adresses secondaires."
                    right={
                        <div className="flex items-center gap-2">
                            {(isDirtyAccount || isDirtyPassword) ? <Pill tone="warn">Modifications non enregistrées</Pill> : <Pill>À jour</Pill>}
                            <Button onClick={() => { handleSave(); setBannerPosition("top") }} disabled={!canSave} className="min-w-[120px]">
                                {isSaving ? "..." : "Enregistrer"}
                            </Button>
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4">
                        <Row isMobile={isMobile} label="Email principal">
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="email"
                                    value={primaryEmail.address}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateEmail(primaryEmail.id, e.target.value)
                                    }
                                    placeholder="email@exemple.com"
                                    className="h-14"
                                />

                                <div className="flex items-center gap-2">
                                    {primaryEmail.verified ? <Pill tone="success">Vérifié</Pill> : <Pill tone="warn">Non vérifié</Pill>}
                                    {!primaryEmail.verified ? (
                                        <Button
                                            variant="ghost"
                                            onClick={() => void resendVerification()}
                                            className="h-9 px-3 text-sm"
                                            type="button"
                                        >
                                            Renvoyer la vérification
                                        </Button>
                                    ) : null}
                                </div>

                                {emailErrors[primaryEmail.id] ? (
                                    <p className="text-sm text-red-200">{emailErrors[primaryEmail.id]}</p>
                                ) : null}
                            </div>
                        </Row>

                        <Row isMobile={isMobile} label="Adresses secondaires">
                            <div className="flex flex-col gap-3">
                                {secondaryEmails.length === 0 ? (
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <p className="text-sm opacity-90">Aucune adresse secondaire pour le moment.</p>
                                    </div>
                                ) : (
                                    secondaryEmails.map((e, idx) => (
                                        <div
                                            key={e.id}
                                            className={`flex items-center gap-2 ${isMobile ? "w-full" : "max-w-[520px]"}`}
                                        >
                                            <div className="w-full">
                                                <Input
                                                    type="email"
                                                    value={e.address}
                                                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                                                        updateEmail(e.id, ev.target.value)
                                                    }
                                                    placeholder={`Nouvelle adresse ${idx + 1}`}
                                                />

                                                <div className="mt-2 flex items-center gap-2">
                                                    {e.verified ? <Pill tone="success">Vérifié</Pill> : <Pill tone="warn">Non vérifié</Pill>}

                                                    {!e.verified ? (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => void resendVerification()}
                                                            className="h-9 px-3 text-sm"
                                                            type="button"
                                                        >
                                                            Renvoyer
                                                        </Button>
                                                    ) : null}

                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => setPrimary(e.id)}
                                                        className="h-9 px-3 text-sm"
                                                        type="button"
                                                    >
                                                        Définir comme principal
                                                    </Button>
                                                </div>

                                                {emailErrors[e.id] ? (
                                                    <p className="mt-1 text-sm text-red-200">{emailErrors[e.id]}</p>
                                                ) : null}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeEmail(e.id)}
                                                className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-[#2C474B] hover:bg-white hover:text-black transition"
                                                aria-label={`Supprimer l'email secondaire ${idx + 1}`}
                                                title="Supprimer"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                )}

                                <Button
                                    onClick={addSecondaryEmail}
                                    className="w-fit cursor-pointer"
                                    type="button"
                                    disabled={Object.keys(emailErrors).length > 0 && secondaryEmails.some((e) => !e.address.trim())}
                                >
                                    + Ajouter une adresse
                                </Button>
                            </div>
                        </Row>
                    </div>
                </Section>

                <Section isMobile={isMobile} title="Mot de passe" subtitle="Mettez à jour votre mot de passe pour sécuriser votre compte.">
                    <div className="flex flex-col gap-4">
                        <Row isMobile={isMobile} label="Mot de passe actuel">
                            <Input
                                type={showPw ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </Row>

                        <Row isMobile={isMobile} label="Nouveau mot de passe">
                            <Input
                                type={showPw ? "text" : "password"}
                                value={newPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                placeholder="Au moins 8 caractères"
                            />
                        </Row>

                        <Row isMobile={isMobile} label="Confirmer">
                            <div className="flex flex-col gap-2">
                                <Input
                                    type={showPw ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                    placeholder="Répéter le nouveau mot de passe"
                                />

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPw((v: boolean) => !v)}
                                        className="text-sm underline underline-offset-4 opacity-90 hover:opacity-100 cursor-pointer"
                                    >
                                        {showPw ? "Masquer" : "Afficher"}
                                    </button>
                                </div>

                                {passwordError ? <p className="text-sm text-red-200">{passwordError}</p> : null}
                            </div>
                        </Row>
                    </div>
                </Section>

                <Section
                    isMobile={isMobile}
                    title="Authentification à deux facteurs (2FA)"
                    subtitle="Ajoutez une couche de sécurité supplémentaire."
                    right={<Pill tone={twoFAEnabled ? "success" : "warn"}>{twoFAEnabled ? "Activée" : "Désactivée"}</Pill>}
                >
                    <div className="flex flex-col gap-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm opacity-90">
                                Avec la 2FA, une validation supplémentaire est demandée lors de la connexion.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="button" onClick={() => void handleToggle2FA()}>
                                {twoFAEnabled ? "Désactiver la 2FA" : "Activer la 2FA"}
                            </Button>

                            {twoFAEnabled ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setBanner({ type: "success", message: "Codes de secours générés." })}
                                >
                                    Générer des codes de secours
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </Section>

                <Section
                    isMobile={isMobile}
                    title="Sessions actives"
                    subtitle="Gérez vos appareils connectés."
                    right={
                        <Button
                            type="button"
                            variant="danger"
                            onClick={signOutAll}
                            disabled={sessions.filter((s) => !s.current).length === 0}
                            className="cursor-pointer"
                        >
                            Déconnecter les autres
                        </Button>
                    }
                >
                    <div className="flex flex-col gap-3">
                        {sessions.map((s) => (
                            <div
                                key={s.id}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <p className="font-semibold">
                                        {s.device} {s.current ? <span className="opacity-70 font-normal">• Cet appareil</span> : null}
                                    </p>
                                    <p className="text-sm opacity-80">
                                        {s.location} • {s.lastActive}
                                    </p>
                                </div>

                                {!s.current ? (
                                    <Button type="button" variant="ghost" onClick={() => signOutSession(s.id)} className="shrink-0 cursor-pointer">
                                        Déconnecter
                                    </Button>
                                ) : (
                                    <Pill>Actif</Pill>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

                <Section isMobile={isMobile} title="Suppression du compte" subtitle="Action irréversible : soyez sûr avant de continuer.">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-white">
                            Supprimer votre compte effacera vos données et désactivera l’accès.
                        </p>

                        <div className="mt-4 flex items-center gap-2">
                            <Button
                                type="button"
                                variant="danger"
                                onClick={async () => {
                                    if (!confirm("Suppression définitive \n\n Toutes vos données seront effacées à jamais. \n\n Confirmer l'envoi de l'email ?")) {
                                        return;
                                    }

                                    try {
                                        setBanner({
                                            type: "info",
                                            message: "Email de confirmation envoyé"
                                        });

                                        await authClient.deleteUser({
                                            callbackURL: window.location.origin + "/"
                                        });


                                        setBanner({
                                            type: "success",
                                            message: "Vérifiez votre boîte email pour finaliser !"
                                        });

                                    } catch (error: any) {
                                        console.error("Erreur:", error);
                                        setBanner({
                                            type: "error",
                                            message: error.message || "Erreur lors de la demande."
                                        });
                                    }
                                }}
                                className="min-w-[200px] cursor-pointer"
                            >
                                Supprimer mon compte
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setBanner({ type: "info", message: "Action simulée : désactivation du compte." })}
                                className="cursor-pointer"
                            >
                                Désactiver temporairement
                            </Button>
                        </div>
                    </div>
                </Section>


                <div className="pt-6 pb-4 flex items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            initialSnapshotRef.current = JSON.stringify({ emails, twoFAEnabled });
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                            setBanner({ type: "info", message: "Modifications annulées." });
                        }}
                        disabled={!(isDirtyAccount || isDirtyPassword) || isSaving}
                    >
                        Annuler
                    </Button>

                    <Button type="button" onClick={() => { handleSave(); setBannerPosition("bottom") }} disabled={!canSave} className="min-w-[140px] cursor-pointer">
                        {isSaving ? "..." : "Enregistrer"}
                    </Button>


                </div>

                {bannerPosition === "bottom" && <Banner banner={banner} />}
            </div>
        </div>
    );
}

