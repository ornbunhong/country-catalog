import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Country {
    cca2: string;
    name: {
        nativeName: {};
        official: string;
    };
    official: string;
    flags: {
        png: string;
    };
    cca3: string;
    altSpellings: [];
    idd: {
        suffixes: [];
    }
    // other properties of the country object
}

const CountryList: React.FC = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);

    // Add state for sorting, searching, and pagination
    const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc'); // 'asc' or 'desc'
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 25;

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            setCountries(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Filter and sort countries based on user input
    const filteredCountries = countries
    .filter((country) =>
    country.name.official.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
    const nameA = a.name.official.toLowerCase();
    const nameB = b.name.official.toLowerCase();
    return sortBy === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });


    function DisplayNativeOfficialName({ country }: { country: Country }): React.ReactNode {
        const firstNativeName = (Object.values(country?.name?.nativeName || {}) as { official?: string }[])[0];
        const nativeOfficial = firstNativeName?.official;
        return nativeOfficial;
    }

    function formatAltSpellings(arr: (string | undefined)[]): string {
        return arr.filter(Boolean).join(', ');
    }

    function DisplayIdd({ country }: { country: Country }): React.ReactNode {
        return Object.values(country.idd.suffixes || {})[0];
    }

    // Pagination logic
    const indexOfLastCountry = currentPage * rowsPerPage;
    const indexOfFirstCountry = indexOfLastCountry - rowsPerPage;
    const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);

    return (
        <div>
            {/* Display paginated countries */}
            <div className="container mt-5">
                <h2 className='mb-4'>Country Catalog</h2>

                <div className='d-flex justify-content-between'>
                    {/* Add search input */}
                    <div className='col-auto'>
                        <input
                            type="text"
                            className='form-control'
                            placeholder="Search by Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Add sorting button */}
                    <button className='btn btn-secondary' onClick={() => setSortBy(sortBy === 'asc' ? 'desc' : 'asc')}>
                        Sort by Country Name ({sortBy})
                    </button>
                </div>

                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Flag</th>
                        <th scope="col">Country Name</th>
                        <th scope="col">cca2</th>
                        <th scope="col">cca3</th>
                        <th scope="col">Native Name</th>
                        <th scope="col">Alt Spellings</th>
                        <th scope="col">IDD</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentCountries.map((country) => (
                        <tr key={country.cca2}>
                            {/* Display country information */}
                            <td><img width="50" src={country.flags.png} alt="" /></td>
                            <td>{country.name.official}</td>
                            <td>{country.cca2}</td>
                            <td>{country.cca3}</td>
                            <td>{DisplayNativeOfficialName({ country })}</td>
                            <td>{formatAltSpellings( country.altSpellings )}</td>
                            <td>{DisplayIdd({ country })}</td>
                        </tr>
                        
                    ))}
                    </tbody>
                </table>

                {/* Add pagination controls */}
                <div className='d-flex justify-content-end'>
                    <button className='btn btn-secondary me-1' onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <button className='btn btn-secondary ms-1' onClick={() => setCurrentPage((prev) => prev + 1)} disabled={indexOfLastCountry >= filteredCountries.length}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CountryList;
