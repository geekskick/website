import CanICatchItApp from './apps/can_i_catch_it/app'
import NathanEats from './apps/nathan_eats/app';
import About from './apps/about/app';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import InfoIcon from '@mui/icons-material/Info';
import PetsIcon from '@mui/icons-material/Pets';
export default class AppFactory {
    static _apps = {
        "Can I Catch It?": {
            icon: () => { return <CatchingPokemonIcon />; },
            app: (infoHandler, errorHandler) => { return <CanICatchItApp info={infoHandler} error={errorHandler} /> }
        },
        "Nathan Eats ...": {
            icon: () => { return <PetsIcon /> },
            app: (infoHandler, errorHandler) => { return <NathanEats info={infoHandler} error={errorHandler} /> }
        },
        "About": {
            icon: () => { return <InfoIcon /> },
            app: (infoHandler, errorHandler) => { return <About info={infoHandler} error={errorHandler} /> }
        }
    };

    static create(name, infoHandler, errorHandler) {
        return AppFactory._apps[name].app(infoHandler, errorHandler);
    }

    static getIconForApp(name) {
        return AppFactory._apps[name].icon();

    }

    static getAvailableApps() {
        return Object.keys(AppFactory._apps);
    }
}

