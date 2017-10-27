#pragma strict

var grade : int[,];
var dim : Vector2 = Vector2(4,4);
var pecasMoviveis = new Array();
private var logs = new Array();
private var barraTerminal : Vector2 = Vector2.zero;
private var iVazio : int = -1;
private var jVazio : int = -1;

function Start () {
var aux : GameObject = new GameObject();
var pecaEliminada : int = Random.Range(0,(dim.x*dim.y));
grade = new int[dim.x,dim.y];
var k : int = 0;
for(var i=0;i<dim.x;i++)
{
	for(var j=0;j<dim.y;j++)
	{
	grade[j,i] = k!=pecaEliminada ? k : -1;
	iVazio = k==pecaEliminada ? i : iVazio;
	jVazio = k==pecaEliminada ? j : jVazio;
	k++;	
	}
}
}

function OnGUI () {
for(var i=0;i<4;i++)
{
GUI.Label(Rect(140,5+(20*i),200,20),"Linha " + (i+1) + " está ordenada? " + (isCorreto()[i]==1 ? "SIM" : "NÃO").ToString());
}
GUI.Label(Rect(140,5+(20*i),200,25),"O problema está resolvido? " + (isCorreto()==Vector4.one ? "SIM" : "NÃO").ToString());
if(GUI.Button(Rect(5,5,130,25),"Resolver problema"))
{
ResolveProblema();
}
GUITabuleiro(Rect(5,35,25,25));
GUI.BeginGroup(Rect(Screen.width-300,0,300,Screen.height));
GUI.Box(Rect(0,0,300,Screen.height),"Terminal");
barraTerminal = GUI.BeginScrollView(Rect(0,30,300,Screen.height-30),barraTerminal,Rect(0,0,300,30+(25+(logs.length*20))));
var k : int = 0;
for(var log in logs)
{
var nextHeight : int = 5+(k*20);
GUI.Label(Rect(5,nextHeight,290,20),log as String);
k++;
}
GUI.EndGroup();
GUI.EndScrollView();
}


var caminho = new Array();
function ResolveProblema () {
for(var x in pecasMoviveis)
{
if(isCorreto()==Vector4.one)
{
break;
}
var aux : Vector2 = x;
MoveBloco(aux[0],aux[1],true);
}
}

function GUITabuleiro (rect : Rect) {
GUI.BeginGroup(Rect(rect.x,rect.y,rect.width*dim.x+10,rect.height*dim.y+30));
GUI.Box(Rect(0,0,rect.width*dim.x+10,rect.height*dim.y+30),"Tabuleiro");
for(var i=0;i<dim.x;i++)
{
	for(var j=0;j<dim.y;j++)
	{
		if(grade[i,j]!=-1)
		{
		//GUI.enabled = isPecaMovivel(i,j);
			if(isPecaMovivel(i,j))
			{
			pecasMoviveis.Add(Vector2(i,j));
			}
			if(GUI.Button(Rect(5+(25*i),25+25*j,25,25),grade[i,j].ToString()))
			{
			MoveBloco(i,j,true);
			}
			GUI.enabled = true;
		}	
	}
}
GUI.EndGroup();
return Rect(rect.x,rect.y,rect.width*dim.x+10,rect.height*dim.y+30);
}

function getPecasMoviveis () {
return pecasMoviveis;
}

function isPecaMovivel (i : int,j : int) {
var s : boolean = false;
	if(i+1<4)
	{
	s = s || grade[i+1,j]==-1;
	}
	if(i-1>=0)			
	{
	s = s || grade[i-1,j]==-1;
	}

	if(j+1<4)
	{			
	s = s || grade[i,j+1]==-1;
	}

	if(j-1>=0)
	{
	s = s || grade[i,j-1]==-1;
	}
return s;
}

function isCorreto () {
var s : Vector4 = Vector4.zero;
for(var i=0;i<dim.x;i++)
{
var aux : int[] = new int[dim.x];
	for(var j=0;j<dim.y;j++)
	{
	aux[j] = grade[j,i];
	}
s[i] = isOrdenado(aux)==true ? 1 : 0;
}
return s;
}

function isOrdenado (v : int[]) {
for(var i=0;i<v.length-1;i++)
{
 if(v[i]<v[i+1] || (v[i]==-1 || v[i+1]==-1)) continue;
 else
	 break;
}
return i==v.length-1;
}



function MoveBloco (iPeca : int,jPeca : int,flagRegistro : boolean) {
if(isPecaMovivel(iPeca,jPeca))
{
	if(flagRegistro)
	{
	logs.Add("Movendo bloco " + grade[iPeca,jPeca] + " para a posição (" + iVazio + "," + jVazio + ")");
	}
grade[iVazio,jVazio] = grade[iPeca,jPeca];
grade[iPeca,jPeca] = -1;

var aux : int = iVazio;
iVazio = iPeca;
iPeca = aux;

aux = jVazio;
jVazio = jPeca;
jPeca = aux;
}
}

function Troca (x : int,y : int) {
}

function isSlotLivre (a : Vector2,direcao : Vector2) {
return true;
}
