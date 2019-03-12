export class Comment {

  kommentar_id: number;
  user_id: number;
  typ: string;
  kommentar_bezugs_id: number;
  kommentar: string;
  likes: number;
  datum: Date;
  ip: string;
  geloescht: number;
  kommentare_id: number[];
  tags: string[];
  kommentare_likes:{like_id:number;
    kommentar_id:number;
    user_id:number;
    datum:Date;
    ip:string;
    bewertung	:number}[];


}
