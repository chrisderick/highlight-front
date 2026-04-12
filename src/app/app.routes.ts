import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'artistas'
	},
	{
		path: 'artistas',
		loadComponent: () =>
			import('./pages/artistas/artistas.component').then((m) => m.ArtistasComponent)
	},
	{
		path: 'artistas/:artistaId/musicas',
		loadComponent: () =>
			import('./pages/musicas/musicas.component').then((m) => m.MusicasComponent)
	},
	{
		path: 'artistas/:artistaId/musicas/:musicaId/letras',
		loadComponent: () =>
			import('./pages/letras/letras.component').then((m) => m.LetrasComponent)
	},
	{
		path: '**',
		redirectTo: 'artistas'
	}
];
