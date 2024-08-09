export default interface UseCase<Params, Result> {
	execute(params: Params): Promise<Result>;
}
