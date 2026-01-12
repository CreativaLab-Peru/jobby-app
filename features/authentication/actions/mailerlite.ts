import {logsService} from "@/features/share/services/logs-service";
import {LogAction, LogLevel} from "@prisma/client";

const API_KEY = process.env.MAILERLITE_API_KEY;
const WELCOME_GROUP_ID = process.env.MAILERLITE_WELCOME_GROUP_ID;
const VERIFY_GROUP_ID = process.env.MAILERLITE_VERIFY_GROUP_ID;
const MAGIC_LINK_GROUP_ID = process.env.MAILERLITE_MAGIC_LINK_GROUP_ID;

type EmailAction = "welcome" | "verify" | "magicLink"

const mapAction = {
    "welcome": WELCOME_GROUP_ID,
    "verify": VERIFY_GROUP_ID,
    "magicLink": MAGIC_LINK_GROUP_ID
}

export async function addToMailerLite(email: string, data?: any, action?: EmailAction) {
    if (!API_KEY || !VERIFY_GROUP_ID || !WELCOME_GROUP_ID) {
        console.error("MailerLite env vars missing");
        await logsService.createLog({
            action: LogAction.EMAIL,
            level: LogLevel.ERROR,
            message: "Validation failed for welcome email",
            email,
            metadata: data,
        });
        return;
    }

    const groupId = mapAction[action]
    if (!groupId) {
        await logsService.createLog({
            action: LogAction.EMAIL,
            level: LogLevel.ERROR,
            message: "No found map action and environment",
            email,
            metadata: {...data, action},
        });
        return;
    }

    try {
        const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + API_KEY,
            },
            body: JSON.stringify({
                email,
                fields: data,
                groups: [groupId],
            })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error("MailerLite error:", err);
        }
    } catch (error) {
        console.error("MailerLite request failed:", error);
        await logsService.createLog({
            email,
            action: LogAction.EMAIL,
            level: LogLevel.ERROR,
            message: "Failed to send email [addToMailerLite]",
            metadata: {
                data
            },
        });
        throw error;
    }
}
