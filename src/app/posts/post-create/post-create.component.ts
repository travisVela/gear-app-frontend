import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';
  mode ='create';
  private postId = ''
  post: Post;
  constructor(
    public ps: PostsService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.post = this.ps.getPost(this.postId);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post: Post = {
      id: this.postId,
      title: form.value.title,
      content: form.value.content
    }

    if (this.mode === 'create') {
      this.ps.addPost(post);
    } else {
      this.ps.updatePost(this.postId, post);
      form.resetForm();
    }
  }



}
