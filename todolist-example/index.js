function clear()
{
	localStorage.clear();
	load();
}

function postaction()
{
	//getElementById 通过id名称访问html中的元素 
	var title = document.getElementById("title");
	if(title.value == "") 
	{
		//没有输入的情况????
		alert("please input something");
		//alert("鍐呭涓嶈兘涓虹┖");
	}
	else
	{
		var data=loadData();//data竟然是一个数组....???
		//loadData大概意思是把string转换为javascript对象?
		//input的id为title 将id为title的内容赋值给todo 这个时候done属性为false
		var todo={"title":title.value,"done":false};
		data.push(todo);//把元素放到到data数组末尾
		saveData(data);
		var form=document.getElementById("form");
		form.reset();
		//这里清空 form输入表单
		load();
	}
}

function loadData()
{
	var collection=localStorage.getItem("todo");
	//用cookie的方式
//localStorage.getItem(key):获取指定key本地存储的值
//localStorage.setItem(key,value)：将value存储到key字段
//localStorage.removeItem(key):删除指定key本地存储的值
	if(collection!=null)
	{
		return JSON.parse(collection);
	}
	else return [];
}

function saveSort()
{
	var todolist=document.getElementById("todolist");
	var donelist=document.getElementById("donelist");
	var ts=todolist.getElementsByTagName("p");
	var ds=donelist.getElementsByTagName("p");
	var data=[];
	for(i=0;i<ts.length; i++)
	{
		var todo={"title":ts[i].innerHTML,"done":false};
		data.unshift(todo);
	}
	for(i=0;i<ds.length; i++)
	{
		var todo={"title":ds[i].innerHTML,"done":true};
		data.unshift(todo);
	}
	saveData(data);
}

function saveData(data)
{
	//本地cookie 键对值的方式
	localStorage.setItem("todo",JSON.stringify(data));
}

function remove(i)
{
	var data=loadData();
	var todo=data.splice(i,1)[0];
	saveData(data);
	load();
}

function update(i,field,value)
{
	var data = loadData();
	var todo = data.splice(i,1)[0];
	todo[field] = value;
	data.splice(i,0,todo);
	saveData(data);
	load();
}

function edit(i)
{
	load();
	var p = document.getElementById("p-"+i);
	title = p.innerHTML;
	p.innerHTML="<input id='input-"+i+"' value='"+title+"' />";
	var input = document.getElementById("input-"+i);
	input.setSelectionRange(0,input.value.length);
	input.focus();
	input.onblur =function(){
		if(input.value.length == 0){
			p.innerHTML = title;
			alert("wrong input");
			//alert("鍐呭涓嶈兘涓虹┖");
		}
		else{
			update(i,"title",input.value);
		}
	};
}

function load()
{
	//获取id为todolist/donelist的ol(order list)，这里要做的就是往order list里面动态添加东西
	var todolist=document.getElementById("todolist");
	var donelist=document.getElementById("donelist");
	var collection=localStorage.getItem("todo");
	//cookie中读数据
	if(collection!=null)
	{
		//json.parse将字符串转换为对象
		var data=JSON.parse(collection);
		var todoCount=0;
		var doneCount=0;
		var todoString="";
		var doneString="";
		for (var i = data.length - 1; i >= 0; i--) {
			if(data[i].done){
				//根据前面输入的内容显示ol中的内容
				//哇 那岂不是每增加一个内容就要全部刷新一次...A
				doneString+="<li draggable='true'><input type='checkbox' onchange='update("+i+",\"done\",false)' checked='checked' />"
				+"<p id='p-"+i+"' onclick='edit("+i+")'>"+data[i].title+"</p>"
				+"<a href='javascript:remove("+i+")'>-</a></li>";
				doneCount++;
			}
			else{
				todoString+="<li draggable='true'><input type='checkbox' onchange='update("+i+",\"done\",true)' />"
				+"<p id='p-"+i+"' onclick='edit("+i+")'>"+data[i].title+"</p>"
				+"<a href='javascript:remove("+i+")'>-</a></li>";
				todoCount++;
			}
		};
		//这部分是将存储的内容展现在页面上
		todocount.innerHTML=todoCount;
		todolist.innerHTML=todoString;
		donecount.innerHTML=doneCount;
		donelist.innerHTML=doneString;
	}
	else{
		todocount.innerHTML=0;
		todolist.innerHTML="";
		donecount.innerHTML=0;
		donelist.innerHTML="";
	}

	var lis=todolist.querySelectorAll('ol li');
	[].forEach.call(lis, function(li) {
		li.addEventListener('dragstart', handleDragStart, false);
		li.addEventListener('dragover', handleDragOver, false);
		li.addEventListener('drop', handleDrop, false);

		onmouseout =function(){
			saveSort();
		};
	});		
}

window.onload=load;

window.addEventListener("storage",load,false);

var dragSrcEl = null;
function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}
function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); 
  }
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  return false;
}