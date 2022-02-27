export function stripString(str) {
    str = str.toLowerCase();
    str = str.replace(/[^\w\s]|_/g, "")
    str = str.replace(/\s/g, "")
    return str
}

export function getStrippedTitles(title) {
    title = title.toLowerCase();

    let withp = title;
    let wop = title;

    for (let i = 0; i < wop.length; i++){
        if ((wop[i] === '(') || (wop[i] === '-')) {
            wop = wop.substring(0, i - 1);
            break;
        }
    }

    withp = stripString(withp);
    wop = stripString(wop);

    return [withp, wop];
}

export function getBlanksFor(str) {
    return '_'.repeat(str.length)
}

export function getStrippedArtists(artists) {
    return artists.map(x => stripString(x))
}

export function listToString(list) {
    if (list.length <= 2) {
        return list.join(' and ')
    }
    return list.slice(0, list.length - 1).join(', ') + ', and ' + list[list.length - 1]
}

// thank you https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}