import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
