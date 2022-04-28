import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import JobsDemo from './components/JobsDemo';
import { IIdentity, selectIdentity } from './features/identity/identitySlice';
import { useAppSelector } from './app/hooks';

export function Routes() {
    const identity: IIdentity = useAppSelector(selectIdentity);

    const validLoginRoutes = [
        <Route path={'/jobs-demo'} key="1" component={JobsDemo} />,
    ];

    return (
        <Switch>
            <Route exact path={'/'} key="0" component={Home} />
            <Route path={'/jobs-demo'} key="1" component={JobsDemo} />
            {/* {identity.userName ? validLoginRoutes.map((route) => route) : <></>} */}
            {/* check if this is the problem with loading home when not logged in */}
            <Redirect to={'/'} />
        </Switch>
    );
}
