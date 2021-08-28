import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import GenerateInventory from './components/GenerateInventory';
import ReprintLabels from './components/ReprintLabels';
import PrinterList from './components/Printers';
import { IIdentity, selectIdentity } from './features/identity/identitySlice';
import { useAppSelector } from './app/hooks';

export function Routes() {
    const identity: IIdentity = useAppSelector(selectIdentity);

    const validLoginRoutes = [
        <Route path={'/generate-inventory'} component={GenerateInventory} />,
        <Route path={'/reprint-labels'} component={ReprintLabels} />,
        <Route path={'/printers'} component={PrinterList} />,
    ];

    return (
        <Switch>
            <Route exact path={'/'} component={Home} />
            {identity.userName ? validLoginRoutes.map((route) => route) : <></>}
            <Redirect to={'/'} />
        </Switch>
    );
}
