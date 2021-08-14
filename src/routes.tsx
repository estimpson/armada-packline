import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import GenerateInventory from './components/GenerateInventory';
import ReprintLabels from './components/ReprintLabels';
import GenerateASN from './components/GenerateASN';
import SupplierSettings from './components/SupplierSettings';
import PrinterList from './components/Printers';

export function Routes() {
    return (
        <Switch>
            <Route exact path={'/'} component={Home} />
            <Route path={'/generate-inventory'} component={GenerateInventory} />
            <Route path={'/reprint-labels'} component={ReprintLabels} />
            <Route path={'/generate-asn'} component={GenerateASN} />
            <Route path={'/printers'} component={PrinterList} />
            <Route path={'/supplier-settings'} component={SupplierSettings} />
            <Redirect to={'/'} />
        </Switch>
    );
}
