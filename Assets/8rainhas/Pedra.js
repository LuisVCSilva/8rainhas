#pragma strict

var corOriginal : Color;
var indice : Vector2;
var rainha : GameObject;
private var Tabuleiro : Tabuleiro;
var isSelecionado : boolean = false;

function Start () {
Tabuleiro = Camera.main.GetComponent.<Tabuleiro>();
corOriginal = GetComponent.<Renderer>().material.color;
}

function Update () {
{
if(rainha!=null)
{
	if(Tabuleiro.mostraRestricoes)
	{
	GetComponent.<Renderer>().material.color = Color.red;
		for(x in Tabuleiro.getProibicoes(gameObject,Vector4(1,1,1,1)))
		{
		(x as GameObject).GetComponent.<Renderer>().material.color = Color.red;
		}
	}
}
}
}

function OnMouseEnter () {
if(rainha==null)
{
GetComponent.<Renderer>().material.color = Tabuleiro.isPosicaoLivre(gameObject) ? Color.green : Color.red;
}
}

function OnMouseDown () {
isSelecionado = !isSelecionado;
if(Tabuleiro.pedraSelecionada!=null)
{
Tabuleiro.pedraSelecionada.GetComponent.<Renderer>().material.color = Tabuleiro.pedraSelecionada.GetComponent.<Pedra>().corOriginal;
Tabuleiro.pedraSelecionada.GetComponent.<Pedra>().isSelecionado = false;
}
Tabuleiro.pedraSelecionada = gameObject;
GetComponent.<Renderer>().material.color = Color.yellow;
}

function OnMouseExit () {
GetComponent.<Renderer>().material.color = (isSelecionado ? Color.yellow : corOriginal);
}

function setIndice (x : Vector2) {
indice = x;
}
