
import {Link} from 'react-router-dom';

export default function Header({onClick}:{onClick?:()=>void}){

    return (
        <header className="bg-white">
            <Link to="/" onClick={onClick}>
                <h1 className="text-5xl font-bold text-center p-10">Anime Search App</h1>
            </Link>
        </header>
    );
}