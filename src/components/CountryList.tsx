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
    const filteredCountries = countries;
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


    return (
        <div>
            {/* Display countries */}
            <div className="container mt-5">
                <h3>Country Catalog</h3>
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
                    {filteredCountries.map((country) => (
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
            </div>
        </div>
    );
};

export default CountryList;
