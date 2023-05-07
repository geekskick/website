import CanICatchItApp from './apps/can_i_catch_it/app';
import Creatures from './apps/creatures/app';
import About from './apps/about/app';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import InfoIcon from '@mui/icons-material/Info';
import PetsIcon from '@mui/icons-material/Pets';
import React from 'react';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RoadTrip from './apps/roadmap/app';

export default class AppFactory {
    static _apps = {
        'Can I Catch It?': {
            icon: () => {
                return <CatchingPokemonIcon />;
            },
            app: (infoHandler, errorHandler) => {
                return <CanICatchItApp info={infoHandler} error={errorHandler} />;
            },
        },
        'Creatures': {
            icon: () => {
                return <PetsIcon />;
            },
            app: (infoHandler, errorHandler) => {
                return <Creatures info={infoHandler} error={errorHandler} />;
            },
        },
        'Road Trip': {
            icon: () => {
                return <DirectionsCarIcon />;
            },
            app: (infoHandler, errorHandler) => {
                return <RoadTrip info={infoHandler} error={errorHandler} />;
            },
        },
        'About': {
            icon: () => {
                return <InfoIcon />;
            },
            app: (infoHandler, errorHandler) => {
                return <About info={infoHandler} error={errorHandler} />;
            },
        },
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

