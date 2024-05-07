import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],

})
export class SidebarComponent {
  bothPanelsExpanded: boolean = false;
  options: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.options = this.formBuilder.group({
 
    });
  }

}