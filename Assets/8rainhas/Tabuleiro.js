#pragma strict

var nLinhas : int = 0;
var nColunas : int = 0;

var pedra : GameObject;
var rainha : GameObject;

var campo : GameObject;
var tabuleiro : GameObject[,];
private var rainhas = new Array();
var pedraSelecionada : GameObject;
private var flagContinua : boolean = false;
var mostraRestricoes : boolean = true;

function Start () {
campo = new GameObject();
tabuleiro = new GameObject[nLinhas,nColunas];
campo.transform.position = Vector3(nLinhas/2,0,nColunas/2);
for(var i=0;i<nLinhas;i++)
{
	for(var j=0;j<nColunas;j++)
	{
	tabuleiro[i,j] = GameObject.Instantiate(pedra,Vector3(i,0,j),Quaternion.identity);
	tabuleiro[i,j].transform.parent = campo.transform;	
	tabuleiro[i,j].name = ((i+1) + "x" + (j+1)).ToString();
	tabuleiro[i,j].GetComponent.<Renderer>().material.color = (i+j)%2==0 ? Color.white : Color.black;
	(tabuleiro[i,j].GetComponent.<Pedra>() as Pedra).setIndice(Vector2(i,j));
	}
}
Camera.main.transform.position = campo.transform.position+Vector3(0,10,0);
}

function Update () {
}


var logs = new Array();
var it : int = 0;
private var isResolvido : boolean = false;
private var barraTerminal : Vector2 = Vector2.zero;
function OnGUI () {
GUI.BeginGroup(Rect(Screen.width-400,0,400,Screen.height));
GUI.Box(Rect(0,0,400,Screen.height),"Terminal");
barraTerminal = GUI.BeginScrollView(Rect(0,30,400,Screen.height-30),barraTerminal,Rect(0,0,400,30+(25+(logs.length*20))));
var k : int = 0;
for(var log in logs)
{
var nextHeight : int = 25+(k*20);
GUI.Label(Rect(5,nextHeight,390,20),log as String);
k++;
}
GUI.EndGroup();
GUI.EndScrollView();
if(GUI.Button(Rect(5,5,140,25),"Resolver problema"))
{
isResolvido = ResolveProblema(0);
logs.Add(isResolvido ? "Problema atual foi resolvido" : "Não foi possível resolver o problema >> " + it);
}

GUI.TextField(Rect(5,35,140,25),pedraSelecionada==null ? "Selecione uma pedra" : "Pedra " + pedraSelecionada.name + " >> " + isPosicaoLivre(pedraSelecionada));
GUI.enabled = pedraSelecionada==null ? false : pedraSelecionada.GetComponent.<Pedra>().rainha!=null;
if(GUI.Button(Rect(5,65,60,25),"Excluir"))
{
DestroiRainha(pedraSelecionada.GetComponent.<Pedra>().indice,true);
pedraSelecionada.GetComponent.<Pedra>().OnMouseEnter();
pedraSelecionada.GetComponent.<Pedra>().OnMouseExit();
}
GUI.enabled = pedraSelecionada==null ? false : isPosicaoLivre(pedraSelecionada);
if(GUI.Button(Rect(70,65,75,25),"Criar"))
{
CriaRainha(pedraSelecionada.GetComponent.<Pedra>().indice,false);
}
GUI.enabled = true;
if(GUI.Button(Rect(5,95,140,25),(!mostraRestricoes ? "Ativa" : "Desativa") + " dicas"))
{
mostraRestricoes = !mostraRestricoes;
	for(var i=0;i<nLinhas;i++)
	{
		for(var j=0;j<nColunas;j++)
		{
		(tabuleiro[i,j].GetComponent.<Pedra>() as Pedra).OnMouseEnter();
		(tabuleiro[i,j].GetComponent.<Pedra>() as Pedra).OnMouseExit();
		}
	}
}
if(GUI.Button(Rect(5,125,140,25),"Reiniciar"))
{
Application.LoadLevel(0);
}
}

var proibicoesDiagonal = new Array();
var proibicoesNeumann = new Array();

function getProibicoes (x : GameObject,dir : Vector4) : Array {
proibicoesDiagonal.Clear();
proibicoesNeumann.Clear();
var s = new Array();
s = _getProibicoesNeumann(x,x,Vector4.one).Concat(_getProibicoesDiagonal(x,Vector4.one));
//s.Add("Restrições de " + x.name + " = {" + s.ToString() + "}");
return s;
}

function _getProibicoesNeumann (xOriginal : GameObject,x : GameObject,dir : Vector4) : Array {
if(dir==Vector4.one)
{
	if(x.GetComponent.<Pedra>().indice.x+1<nLinhas)
	{
	proibicoesNeumann.Add(tabuleiro[x.GetComponent.<Pedra>().indice.x+1,x.GetComponent.<Pedra>().indice.y]);
	_getProibicoesNeumann(xOriginal,proibicoesNeumann[proibicoesNeumann.length-1] as GameObject,Vector4(1,1,1,1));
	}
	else
	{
	_getProibicoesNeumann(xOriginal,xOriginal,Vector4(1,0,1,0));		
	}
}
if(dir==Vector4(1,0,1,0))
{
	if(x.GetComponent.<Pedra>().indice.x-1>=0)
	{
	proibicoesNeumann.Add(tabuleiro[x.GetComponent.<Pedra>().indice.x-1,x.GetComponent.<Pedra>().indice.y]);
	_getProibicoesNeumann(xOriginal,proibicoesNeumann[proibicoesNeumann.length-1] as GameObject,Vector4(1,0,1,0));
	}
	else
	{
	_getProibicoesNeumann(xOriginal,xOriginal,Vector4(1,1,0,0));	
	}
}
if(dir==Vector4(1,1,0,0))
{
	if(x.GetComponent.<Pedra>().indice.y+1<nColunas)
	{
	proibicoesNeumann.Add(tabuleiro[x.GetComponent.<Pedra>().indice.x,x.GetComponent.<Pedra>().indice.y+1]);
	_getProibicoesNeumann(xOriginal,proibicoesNeumann[proibicoesNeumann.length-1] as GameObject,Vector4(1,1,0,0));
	}
	else
	{
	_getProibicoesNeumann(xOriginal,xOriginal,Vector4(0,0,1,1));		
	}
}
if(dir==Vector4(0,0,1,1))
{
	if(x.GetComponent.<Pedra>().indice.y-1>=0)
	{
	proibicoesNeumann.Add(tabuleiro[x.GetComponent.<Pedra>().indice.x,x.GetComponent.<Pedra>().indice.y-1]);
	_getProibicoesNeumann(xOriginal,proibicoesNeumann[proibicoesNeumann.length-1] as GameObject,Vector4(0,0,1,1));
	}
	else
	{
	proibicoesNeumann.Add(proibicoesNeumann[0]);
	}
}
return proibicoesNeumann;
}


function _getProibicoesDiagonal (x : GameObject,dir : Vector4) : Array {
if(x.GetComponent.<Pedra>().indice.x+1<nLinhas)
{
	if(x.GetComponent.<Pedra>().indice.y+1<nColunas && dir.x==1)
	{
	proibicoesDiagonal.Add(tabuleiro[x.GetComponent.<Pedra>().indice.x+1,x.GetComponent.<Pedra>().indice.y+1]);
		if((proibicoesDiagonal[proibicoesDiagonal.length-1] as GameObject).GetComponent.<Pedra>().indice.x!=0)
		{
		_getProibicoesDiagonal(proibicoesDiagonal[proibicoesDiagonal.length-1] as GameObject,Vector4(1,0,0,0));
		}
	}
	if(x.GetComponent.<Pedra>().indice.y-1>=0 && dir.y==1)
	{
	proibicoesDiagonal.Add(tabuleiro[x.GetComponent.<Pedra>().indice.x+1,x.GetComponent.<Pedra>().indice.y-1]);
		if((proibicoesDiagonal[proibicoesDiagonal.length-1] as GameObject).GetComponent.<Pedra>().indice.x!=0)
		{
		_getProibicoesDiagonal(proibicoesDiagonal[proibicoesDiagonal.length-1] as GameObject,Vector4(0,1,0,0));
		}
	}
}
if(x.GetComponent.<Pedra>().indice.x-1>=0)
{
	if(x.GetComponent.<Pedra>().indice.y+1<nColunas && dir.z==1)
	{
	proibicoesDiagonal.Add(tabuleiro[x.GetComponent.<Pedra>().indice.x-1,x.GetComponent.<Pedra>().indice.y+1]);
		if((proibicoesDiagonal[proibicoesDiagonal.length-1] as GameObject).GetComponent.<Pedra>().indice.x!=0)
		{
		_getProibicoesDiagonal(proibicoesDiagonal[proibicoesDiagonal.length-1] as GameObject,Vector4(0,0,1,0));
		}
	}
	if(x.GetComponent.<Pedra>().indice.y-1>=0 && dir.w==1)
	{
	proibicoesDiagonal.Add(tabuleiro[x.GetComponent.<Pedra>().indice.x-1,x.GetComponent.<Pedra>().indice.y-1]);	
		if((proibicoesDiagonal[proibicoesDiagonal.length-1] as GameObject).GetComponent.<Pedra>().indice.x!=0)
		{
		_getProibicoesDiagonal(proibicoesDiagonal[proibicoesDiagonal.length-1] as GameObject,Vector4(0,0,0,1));
		}
	}
}
return proibicoesDiagonal;
}


/*
2) Se todas as rainhas estao postas entao
    retorne (V)
3) Experimente todas as linhas da coluna atual. Para cada linha teste:
     a) Se a rainha pode ser colocada nesta linha, em seguida, marcar esta posição como parte da solução
	 e recursivamente verificar se colocando rainha na dita posição leva a uma solução.
     b) Se a colocação da rainha na posição leva a uma solução, se sim, entao
         retorne (V)
     c) Se colocar uma rainha nesta posição entao desmarque essa posição (tire a rainha desta posição), faça o backtrack e continue testando para as outras linhas.
3) Se todas as linhas foram testadas e nenhuma das condições acima foi satisfeita, retorne (F) para backtracking.
*/
function ResolveProblema (col : int) : boolean {
    if (col >= nLinhas)
        return true;
 
    for (var i = 0; i < nLinhas; i++)
    {
        if ( isPosicaoLivre(tabuleiro[i, col]))
        {

            CriaRainha(Vector2(i,col),true);
 
            if ( ResolveProblema(col + 1) )
                return true;
 
            DestroiRainha(Vector2(i,col),false);
        }
    }
return false;
}


function DestroiRainha (v : Vector2,superPoderes : boolean) {
it--;
if((tabuleiro[v.x,v.y].GetComponent.<Pedra>().rainha as GameObject).GetComponent.<Rainha>().isDestrutivelPelaIA==true || superPoderes==true)
{
logs.Add("Destruindo rainha na posição " + v);
rainhas.Remove(tabuleiro[v.x,v.y]);
GameObject.Destroy(tabuleiro[v.x,v.y].GetComponent.<Pedra>().rainha);


tabuleiro[v.x,v.y].GetComponent.<Pedra>().rainha = null;
tabuleiro[v.x,v.y].GetComponent.<Pedra>().isSelecionado = false;

var proibicoes = getProibicoes(tabuleiro[v.x,v.y],Vector4(1,1,1,1));
for(d in proibicoes)
{
(d as GameObject).GetComponent.<Pedra>().OnMouseExit();
}
}
else
{
logs.Add("Não pôde destruir a rainha " + v + " -> Definição de usuário");
}
}

function CriaRainha (v : Vector2,isDestrutivel : boolean) {
it++;
if(isPosicaoLivre(tabuleiro[v.x,v.y]) && tabuleiro[v.x,v.y].GetComponent.<Pedra>().rainha==null)
{
logs.Add("Criando rainha na posição " + v + " -> isDestrutível = " + isDestrutivel);
var novaRainha : GameObject = GameObject.Instantiate(rainha,tabuleiro[v.x,v.y].transform.position+Vector3(0.4,0,-0.5),Quaternion.identity);
novaRainha.name = "Rainha " + tabuleiro[v.x,v.y].name;
tabuleiro[v.x,v.y].GetComponent.<Pedra>().rainha = novaRainha;
tabuleiro[v.x,v.y].GetComponent.<Pedra>().rainha.GetComponent.<Rainha>().isDestrutivelPelaIA = isDestrutivel;
var proibicoes = getProibicoes(tabuleiro[v.x,v.y],Vector4(1,1,1,1));
rainhas.Add(novaRainha,true);
}
else
{
logs.Add("Nao pode criar rainha na posicao " + v);
}
}



function isPosicaoLivre (pos : GameObject) : boolean {
var s : boolean = pos.GetComponent.<Pedra>().rainha==null;
for(it in getProibicoes(pos,Vector4.one))
{
s = (it as GameObject).GetComponent.<Pedra>().rainha==null;
	if(!s)
	{
	break;
	}
}
return s;
}
