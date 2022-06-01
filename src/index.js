import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryList.style.listStyle = 'none';
countryInfo.style.marginLeft = '40px';

function clearCountriesBlock() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
};

input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(event) {
    const userInputValue = event.target.value.trim();

    if (userInputValue === '') {
        clearCountriesBlock();
        return;
    }

    fetchCountries(userInputValue)
        .then(countries => {
            clearCountriesBlock();
            if (countries.length === 1) {
                clearCountriesBlock();
                renderOneCountry(countries);

            } else if (countries.length >= 10) {
                clearCountriesBlock();
                Notify.info('Too many matches found. Please enter a more specific name');

            } else {
                clearCountriesBlock();
                renderUserList(countries);
            }
            
        })
        .catch(() => {
            Notify.failure('Oops, there is no country with that name');
        })
};

function renderOneCountry(users) {
    const markup = users
        .map((user) => {
            return `<img src = ${user.flags.svg} width="80"/><span style="font-size:40px"> ${user.name.official}</span>
            <p><b>Capital:</b> ${user.capital}</p>
            <p><b>Population:</b> ${new Intl.NumberFormat('en').format(user.population)}</p>
            <p><b>Languages:</b> ${Object.values(user.languages)}</p>`;
        })
        .join("");

    countryInfo.innerHTML = markup;
    
};
function renderUserList(users) {
    const markup = users
        .map((user) => {
            return `<li><img src = "${user.flags.svg}" alt = "${user.name.official}" width="60"/>
            <span style="font-size:20px">${user.name.official}</span>
            </li>`;
        })
        .join("");
    
    countryList.innerHTML = markup;
};