import { createTransport } from 'nodemailer';
import DataStore from "nedb";
import Database from "../../database/database_handler"

type smtp = {
    host: string;
    port: number;
    username: string;
    password: string;
}

export default async function sendEmail(to: string, subject: string, text: string, html: string): Promise<any> {
    try {
        const config: any = Database.getInstance().getDataStore()?.config

        // new DataStore({
        // 	filename: "./data/config.json",
        // 	autoload: true,
        // 	timestampData: true,
        // });

        if (!config) throw new Error("Failed to get config");
        const appConfig: any = await new Promise((resolve, reject) => {
            config.findOne({}, function (err: any, docs: any) {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });

        if (!appConfig) throw new Error("Failed to get appConfig");

        const smtp: smtp = appConfig.smtp;
        if (!smtp) throw new Error("No smtp configuration found");

        const transporter = createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp.username,
                pass: smtp.password,
            },
        });

        const info = await transporter.sendMail({
            from: `"${smtp.username}" <${smtp.username}>`, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html, // html body
        });

        return info;


    } catch (err) {
        return err;
    }
}