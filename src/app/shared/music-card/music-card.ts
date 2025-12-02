import { Component, input } from '@angular/core';
import { CardItem } from '../../models/music-card.model';

@Component({
  selector: 'app-music-card',
  imports: [],
  templateUrl: './music-card.html',
  styleUrl: './music-card.css',
})
export class MusicCard {

  data = input.required<CardItem>();

}
