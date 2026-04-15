// AssemblyScript word card quiz module.
export const english: Array<string> = [
  "the","be","and","of","a","in","to","have","it","I",
  "that","for","you","he","with","on","do","say","this","they",
  "at","but","we","his","from","not","by","she","or","as","what",
  "go","their","can","who","get","if","would","her","all","my",
  "make","about","know","will","as","up","one","time","there","year",
  "so","think","when","which","them","some","me","people","take","out",
  "into","just","see","him","your","come","could","now","than","like",
  "other","how","then","its","our","two","more","these","want","way","look",
  "first","also","new","because","day","use","no","man","find","here",
  "thing","give","many","well","only","those","tell","very","even","back","any",
  "good","woman","through","work","life","child","world","school","state","family"
];

export const german: Array<string> = [
  "der/die/das","sein","und","von","ein","in","zu","haben","es","ich",
  "dass","für","du","er","mit","auf","tun","sagen","dies","sie",
  "bei","aber","wir","sein","von","nicht","durch","sie","oder","als","was",
  "gehen","ihr","können","wer","bekommen","wenn","würde","ihr","alle","mein",
  "machen","über","wissen","werde","wie","auf","eins","Zeit","dort","Jahr",
  "so","denken","wann","welche","sie","einige","mir","Leute","nehmen","aus",
  "in","einfach","sehen","ihn","dein","kommen","konnte","jetzt","als","mögen",
  "anderer","wie","dann","sein","unser","zwei","mehr","diese","wollen","Weg","schauen",
  "erst","auch","neu","weil","Tag","benutzen","nein","Mann","finden","hier",
  "Ding","geben","viele","gut","nur","diese","sagen","sehr","sogar","zurück","irgendein",
  "gut","Frau","durch","arbeiten","Leben","Kind","Welt","Schule","Staat","Familie"
];

export function maxIndex(): i32 {
  return english.length;
}

export function getEnglish(index: i32): string {
  return english[index];
}

export function getGerman(index: i32): string {
  return german[index];
}

export function checkGerman(index: i32, answer: string): bool {
  return answer == german[index];
}
