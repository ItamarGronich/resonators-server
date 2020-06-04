import ctx from 'request-local';

export default function getUnitOfWork() {
    const uow = ctx.data.uow;
    return uow;
}
