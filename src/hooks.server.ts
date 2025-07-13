import { connect } from '$lib/server/db';

connect().then((): void => {
    console.log('MongoDB Started');
}).catch((e: Error) => {
    console.log('MongoDB failed to start');
    console.log(e);
});