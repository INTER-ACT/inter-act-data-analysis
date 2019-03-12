import { Pipe, PipeTransform } from '@angular/core';
import {Comment} from './comment/comment';

@Pipe({
  name: 'commentsFilter'
})
export class CommentsFilterPipe implements PipeTransform {

  transform(comments: Comment[], filter_id: number): Comment[] {
    if (comments.length===0 || filter_id===null)
      return comments;
    const resultArray=[];
    for (const comment of comments) {
      if (comment.kommentar_id === filter_id)
        resultArray.push(comment);
    }
    return resultArray;

  }

}
