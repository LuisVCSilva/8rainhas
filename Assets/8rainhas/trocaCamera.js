#pragma strict

var cameras : Camera[];
private var k = 0;
function Update () {
if(Input.GetKeyDown(KeyCode.C))
{
cameras[k].enabled = false;
k++;
k = k%cameras.length;
cameras[k].enabled = true;
}
}
