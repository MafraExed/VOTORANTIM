"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define([],function(){return{initializeQuillEditor:function e(t){var i=t.container,n=t.placeholder,a=t.setup;return new tinymce.Editor("".concat(i.id),{plugins:["advlist autolink lists link image charmap print preview anchor","searchreplace visualblocks code fullscreen","insertdatetime media table paste code help wordcount"],toolbar:"undo redo | formatselect | "+"bold italic backcolor | alignleft aligncenter "+"alignright alignjustify | bullist numlist outdent indent | "+"removeformat | help",content_style:"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",placeholder:n,setup:a},tinymce.EditorManager)},removeEditorManager:function e(){tinymce.EditorManager.remove()}}});