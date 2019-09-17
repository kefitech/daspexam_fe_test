import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routings: Routes = [
    { path: 'landing', 
    loadChildren: () => import(`../PageModules/landing/landing.module`)
    .then(m => m.LandingModule)},
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: '**', redirectTo: 'landing', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routings)],
    exports: [RouterModule],
    entryComponents: []
})

export class Routing { }