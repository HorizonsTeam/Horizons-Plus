import auth from '../../dist/auth.js';
import { fromNodeHeaders } from 'better-auth/node';
import { v4 as uuidv4 } from 'uuid';

export async function attachUserOrGuest(req, res, next) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (session) {
            req.session = session;
            req.userId = session.user.id;
            req.sessionId = null;
            req.isGuest = false;
        } else {
            let guestId = req.cookies?.guestId;
            
            if (!guestId) {
                guestId = uuidv4();
                res.cookie('guestId', guestId, {
                    httpOnly: true,
                    sameSite: 'lax',
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
                });
            }

            req.userId = null;
            req.sessionId = guestId;
            req.isGuest = true;
        }

        next();
    } catch (error) {
        console.error("Erreur auth:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
}