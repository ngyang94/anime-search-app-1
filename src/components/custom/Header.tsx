
import {Link} from 'react-router-dom';

import './Header.css';

export default function Header(){

    return (
        <header className="bg-white">
            <Link to="/">
                <h1 className="text-5xl font-bold text-center p-10">Anime Search App</h1>
            </Link>
        </header>
    );
}