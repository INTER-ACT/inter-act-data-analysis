export class User {
  user_id: number;
  username: string;
  email: string;
  passwort: string;
  vorname: string;
  nachname: string;
  is_male: boolean;
  plz: string;
  ort: string;
  beruf: string;
  geb_jahr: number;
  rechtskenntnisse: number;
  ausbildung: number;
  hash: string;
  gesperrt: boolean;
  geloescht: boolean;
  aktiv: boolean;
  ip: string;
  reg_datum: Date;
  aktiv_datum: Date;
  aktivitaeten:Array<{aktivitaet:string; datum:Date;}>

}
