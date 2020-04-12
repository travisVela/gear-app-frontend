import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredValue = '';
  post = 'NO CONTENT';

  constructor() { }

  ngOnInit() {
  }

  onAddPost() {
    this.post = this.enteredValue;
  }

}
