import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Estado { id: number; descricao: string; sigla: string; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  estados: Estado[] = [];
  private apiUrl = 'http://localhost:8000/api/estados';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Estado[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Estados recebidos!', data);
        this.estados = data;
      },
      error: (err) => console.error('Falha ao buscar estados!', err)
    });
  }
}