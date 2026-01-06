import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './core/layout/navbar/navbar';
import {Player} from './features/player/player';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Player],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('music-stream');
}
