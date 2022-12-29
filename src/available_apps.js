import CanICatchItApp from './apps/can_i_catch_it/app'
import NathanEats from './apps/nathan_eats/app';
import About from './apps/about/app';

export default class AppFactory {
    static _apps = {
        "Can I Catch It?": (infoHandler, errorHandler) => { return <CanICatchItApp info={infoHandler} error={errorHandler} /> },
        "Nathan Eats ...": (infoHandler, errorHandler) => { return <NathanEats info={infoHandler} error={errorHandler} /> },
        "About": (infoHandler, errorHandler) => { return <About info={infoHandler} error={errorHandler} /> }
    };

    static create(name, infoHandler, errorHandler) {
        return AppFactory._apps[name](infoHandler, errorHandler);
    }

    static getAvailableApps() {
        return Object.keys(AppFactory._apps);
    }
}

