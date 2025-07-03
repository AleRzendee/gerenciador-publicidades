import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Estado {
  id: number;
  descricao: string;
  sigla: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html', // Apontando para o arquivo HTML correto
  styleUrls: ['./app.component.css']   // Apontando para o arquivo CSS correto
})
export class AppComponent implements OnInit {

  title = 'frontend-app'; // Mantendo a propriedade title que pode existir
  estados: Estado[] = [];
  private apiUrl = 'http://localhost:8000/api/estados';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Estado[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Estados recebidos do backend:', data);
        this.estados = data;
      },
      error: (err) => {
        console.error('Erro ao buscar estados:', err);
        alert('Erro ao buscar dados do backend. Verifique o console (F12) e se o servidor do backend está rodando.');
      }
    });
  }
}