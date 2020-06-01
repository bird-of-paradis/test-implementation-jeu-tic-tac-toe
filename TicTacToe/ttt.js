// Nous utiliserons deux images, une pour le 'x' et l'autre pour le 'o'
var xImg = "x.jpg", oImg = "o.jpg";

// Initialement, c'est le joueur 1 qui commence
var joueur1 = true;

// La fin n'arrive pas au début
var fin = false;

// Variables permettant de faire l'ordinateur
var vides = [], numbers = [], imgs = [];

/*
 Fonction appelée à chaque fois qu'on clique sur une case.
 Elle permet de gérer les signes et le déroulement de la partie.
*/
function placerSigne(element) {
   // Pour commencer, vérifions si la case où on veut mettre un signe est bel et bien vide
   if (nomFichier(element.src) == "vide.jpg" && fin == false) {
      element.src = joueur1 ? "img/"+xImg : "img/"+oImg;
      // Est-ce que joueur 1 gagne ?
      if (gagne(xImg)) {
         statutPartie.innerHTML = "Vous avez gagné!";
         fin = true;
         gEBI("bRecommencer").style.display = "";
      } else {
         // Est-ce que joueur 2 gagne ?
         if (gagne(oImg)) {
            statutPartie.innerHTML = "Vous avez perdu !";
            fin = true;
            gEBI("bRecommencer").style.display = "";
         } else {
            // Le jeu est-il complet ? (partie nulle en sachant le reste)
            if (jeuComplet()) {
               statutPartie.innerHTML = "Partie nulle...";
               fin = true;
               gEBI("bRecommencer").style.display = "";
            }
            // Sinon, la partie continue normalement
            else {
               joueur1 = !joueur1;
               if (joueur1) {
                  statutPartie.innerHTML = "C'est votre tour...";
               } else {
                  statutPartie.innerHTML = "Veuillez patienter ...";
                  setTimeout(function() {
                     imgs = document.querySelectorAll('img');
                     imgs.forEach(function(item, i){
                        if (item.currentSrc.indexOf('vide.jpg') !== -1) {
                           vides.push(item)
                           numbers.push(i);
                        }
                     });
                     var n = randNumber(numbers);
                     vides.length = 0;
                     numbers.length = 0
                     imgs.length = 0;
                     placerSigne(imgs[n]);
                  }, 1000);

               }
              
            }
         }
      }
   }
   gEBI("bRecommencer").style.display = "";
}

/*
 Fonction qui retourne un entier choisi
 au hasard dans la liste
*/
function randNumber(arg) {
   if (Array.isArray(arg)) {
       return arg[randNumber(arg.length)];
   } else if (typeof arg === "number") {
       return Math.floor(Math.random() * arg);
   } else {
       return 0;  // chosen by fair dice roll
   }
}

/*
 Fonction pour vérifier si le jeu est complet.
 Elle consiste à s'assurer qu'il n'y a aucune
 case vide.
*/
function jeuComplet() {
   rempli = true;
   i=0;
   while (i<=2 && rempli) {
      j=0;
      while (j<=2 && rempli) {
         boxSrc = nomFichier(gEBI("box"+i+"_"+j).src);
         if (boxSrc != xImg && boxSrc != oImg)
            rempli = false;
         else
            j++;
      }
      i++;
   }
   
   return rempli;

}

/*
 Fonction qui vérifie si un joueur gagne.
 Il gagne si l'ensemble de ses signes forment
 au moins une ligne ou une diagonale
*/
function gagne(nomImage) {
   return ligneH(nomImage) || ligneV(nomImage) || diag1(nomImage)
         || diag2(nomImage) ? true : false;
}

/*
 Fonction qui vérifie la présence d'au moins
 une ligne horizontale pleine
*/
function ligneH(nomImage) {
   ligne = false;
   i=0;
   while (i <= 2 && !ligne) {
      ligne = true;
      j=0;
      while (j <= 2 && ligne) {
         boxSrc = nomFichier(gEBI("box"+i+"_"+j).src);
         if (boxSrc != nomImage)
            ligne = false;
         else
            j++;
      }
      i++
   }
   
   return ligne;
}

/*
 Fonction qui vérifie la présence d'au moins
 une ligne verticale pleine
*/
function ligneV(nomImage) {
   ligne = false;
   i=0;
   while (i <= 2 && !ligne) {
      ligne = true;
      j=0;
      while (j <= 2 && ligne) {
         boxSrc = nomFichier(gEBI("box"+j+"_"+i).src);
         if (boxSrc != nomImage)
            ligne = false;
         else
            j++;
      }
      i++;
   }

   return ligne;
}

/*
 Fonction qui vérifie si la diagonale '/' est pleine.
*/
function diag1(nomImage) {
   diag = true;
   i=0;
   j=0;
   while (i <= 2 && diag) {
      boxSrc = nomFichier(gEBI("box"+i+"_"+j).src);
      if (boxSrc != nomImage)
         diag = false;
      else {
         i++;
         j++;
      }
   }

   return diag;
}

/*
 Fonction qui vérifie si la diagonale '\' est pleine.
*/
function diag2(nomImage) {
   diag = true;
   i=2;
   j=0;
   while (i >= 0 && diag) {
      boxSrc = nomFichier(gEBI("box"+i+"_"+j).src);
      if (boxSrc != nomImage)
         diag = false;
      else {
         i--;
         j++;
      }
   }

   return diag;
}

/*
 Fonction qui met fin à la partie.
 On vide toutes les cases et on met
 le tour à l'utilisateur.
*/
function finPartie() {
   for (i=0; i<=2; i++)
      for (j=0; j<=2; j++)
         gEBI("box"+i+"_"+j).src = "img/vide.jpg";
		 
   joueur1 = true;
   statutPartie.innerHTML = "C'est votre tour...";
   fin = false;
   gEBI("bRecommencer").style.display = "none";
}

/*
 Si on se sert de noms de fichiers, il faut s'armer d'une fonction
 qui nous permettra de récupérer seulement le nom de l'image, et
 non le chemin au complet.
*/
function nomFichier(chemin) {
   return chemin.substring(chemin.lastIndexOf('/')+1, chemin.length);
}

/*
 Tout simplement pour sauver du code.
 Une fonction qui remplace le long et
 pénible "document.getElementById(id)"
*/
function gEBI(id) {
   return document.getElementById(id);
}