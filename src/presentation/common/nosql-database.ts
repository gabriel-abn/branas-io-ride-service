export default interface NoSqlDatabase {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	// query(filter: { [key: string]: any }): Promise<{ rows: any[] }>;
}
