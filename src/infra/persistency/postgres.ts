import { Pool } from "pg";
import type RelationalDatabase from "src/presentation/common/relational-database";

export default class Postgres implements RelationalDatabase {
	private connection: Pool;
	private static instance: Postgres;

	private constructor() {
		const databaseUrl = process.env.DATABASE_URL
			? process.env.DATABASE_URL
			: "postgres://postgres:123456@localhost:5432/ride";
		this.connection = new Pool({
			connectionString: databaseUrl,
		});
	}

	async connect(): Promise<void> {
		await this.connection.connect();
	}

	async execute(sql: string, values: any[]): Promise<{ executed: boolean; rowsAffected: number; rows?: any[] }> {
		try {
			const { rows, rowCount } = await this.connection.query(sql, values);

			return { executed: rowCount ? rowCount > 0 : false, rowsAffected: rowCount || 0, rows };
		} catch (error: any) {
			throw new Error(`Postgres: Failed to execute query. ${error.message}`);
		}
	}

	async query(sql: string, values: any[]): Promise<{ rows: any[] }> {
		const { rows } = await this.connection.query(sql, values);

		return { rows };
	}

	async disconnect() {
		await this.connection.end();
	}

	static getInstance() {
		if (!Postgres.instance) {
			Postgres.instance = new Postgres();
		}

		return Postgres.instance;
	}
}
