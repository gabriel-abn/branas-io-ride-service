export default interface RelationalDatabase {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	query(sql: string, values: any[]): Promise<{ rows: any[] }>;
	execute(sql: string, values: any[]): Promise<{ executed: boolean; rowsAffected: number; rows?: any[] }>;
}
