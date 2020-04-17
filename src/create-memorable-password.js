async function createMemorablePassword(dictionary, options) {
    let opts = (undefined !== options && 'object' === typeof options && 0 < Object.keys(options).length ) ? options : {}
    let password = [],
    words = {
        upperCase: (opts.hasOwnProperty('upperCase')) ? opts.upperCase : 'alternate', /* 'none', 'all', 'alternate', 'random' */
        upperCaseNext: false,
    }, 
    maxNumber = (opts.hasOwnProperty('maxNumber')) ? opts.maxNumber : 100,
    maxWordLength = (opts.hasOwnProperty('maxWordLength')) ? opts.maxWordLength : null,
    pattern = (opts.hasOwnProperty('pattern')) ? [...opts.pattern] : [...'wdw'];
    
    try {
        if (!Array.isArray(dictionary)) { throw 'dictionary is not an array.'}
        if (Array.isArray(dictionary) && 0 > dictionary.length) { throw 'dictionary has a length of 0'}

        /* Filter dictionary if maxWordLength is set */
        dictionary = filterDictionary(dictionary, maxWordLength);

        /* If upperCase is alternate, randomize the initial state */
        if ('alternate' === words.upperCase) {
            words.upperCaseNext = !!Math.round(Math.random());
        }
        
        password = pattern.map( (character, index) => {
            let part;
            if ('w' === character) {
                part = getWord(dictionary);

                switch (words.upperCase) {
                    case 'none':
                        part = part.toLowerCase();
                        words.upperCaseNext = false;
                        break;
                    case 'all':
                        part = part.toUpperCase();
                        words.upperCaseNext = true;
                        break;
                    case 'alternate':
                        if (words.upperCaseNext) {
                            part = part.toUpperCase();
                        }
                        words.upperCaseNext = !words.upperCaseNext;
                        break;
                    case 'random':
                        if (words.upperCaseNext) {
                            part = part.toUpperCase()
                        }
                        words.upperCaseNext = !!Math.round(Math.random());
                        break;
                    default:
                        break;
                }                
            }
            if ('d' === character) { 
                part = getDigits(maxNumber);
            }
            return part;
        })
                
        return password.join('');
    
    } catch(err) {
        return err
    }
}

function filterDictionary(dictionary, maxWordLength) {
    return (null !== maxWordLength) ? dictionary.filter( word => word.length <= maxWordLength ) : dictionary;
}

function getDigits(maxNumber) {
    let padLength = getPadLength(maxNumber);
    let digits = Math.floor(Math.random() * maxNumber);
    if (69 === digits) { digits = 68 } /* Ain't nobody got time for that */
    digits += '';
    digits = digits.padStart(padLength, '0')
    return digits;
}

/**
 * Calculate number of zeroes to pad left.
 * If maxNumber is divisible by 10, reduce the number by 1.
 * E.g. if maxNumber == 100, we want to generate numbers between 00 and 99, so only one-digit numbers would be padded.
 */
function getPadLength(maxNumber) {
    return (0 === maxNumber % 10) ? (maxNumber + '').length - 1 : (maxNumber + '').length;
 }

function getWord(dictionary) {
    return dictionary[ Math.floor(Math.random() * dictionary.length) ];
}

export { createMemorablePassword };