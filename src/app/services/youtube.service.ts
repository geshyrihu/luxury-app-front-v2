import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { IYoutubeResponse } from 'src/app/interfaces/IYoutubeResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private http = inject(HttpClient);

  private youtubeUrl = 'https://www.googleapis.com/youtube/v3';
  private apikey = 'AIzaSyCXDdNxelC651_ZyRgUfy-4emxtHLTCUd0';
  private playlist = 'UUUULwWNl9Wmky4YQ4a4bejA';
  public nextPageToken = '';
  public valideVideos = true;

  getVideos() {
    const url = `${this.youtubeUrl}/playlistItems`;

    const params = new HttpParams()
      .set('key', this.apikey)
      .set('part', 'snippet')
      .set('maxResults', '2000')
      .set('playlistId', this.playlist)
      .set('pageToken', this.nextPageToken);

    return this.http.get<IYoutubeResponse>(url, { params }).pipe(
      map((resp) => {
        if (resp.nextPageToken === undefined) {
          this.valideVideos = false;
        }
        this.nextPageToken = resp.nextPageToken;
        return resp.items;
      }),

      map((items) => items.map((video) => video.snippet))
    );
  }
}
