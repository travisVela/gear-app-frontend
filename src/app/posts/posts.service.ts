import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient
  ) { }

  getPosts() {
    return this.http.get<{message: string, posts: Post[]}>(environment.api + '/api/posts')
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next([...this.posts]);
      })
    
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    const postOb: Post = {
      id: null,
      title: post.title,
      content: post.content
    }
    this.http.post<{message: string}>(environment.api + '/api/posts', post)
      .subscribe(res => {
        console.log(res.message);
        this.posts.push(postOb);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
