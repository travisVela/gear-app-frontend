import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  // posts = [
  //   {
  //     title: 'First Post', content: 'This is the first post content'
  //   },
  //   {
  //     title: 'Second Post', content: 'This is the second post content'
  //   },
  //   {
  //     title: 'Third Post', content: 'This is the third post content'
  //   }
  // ]

  posts: Post[] = [];
  private postsSub: Subscription

  constructor(
    public ps: PostsService
  ) { }

  ngOnInit() {
    this.ps.getPosts();
    this.postsSub =  this.ps.getPostsUpdatedListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    })
  }

  onDelete(postId: string) {
    this.ps.deletePost(postId);
  }


  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
  }

}
