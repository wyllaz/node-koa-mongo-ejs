var MongoClient = require('mongodb').MongoClient;

var Config=require('./config.js');

class Db{
    static getInstance(){   /**单例，多次实例化实例不共用问题*/

        if(!Db.instance){
            Db.instance=new Db();
        }
        return  Db.instance;
    }
    constructor(){
        this.dbClient=''; /** 解决多次连接数据库问题*/
        this.connect();

    }
    connect(){
        let _that=this;
        return new Promise((resolve,reject)=>{
            if(!_that.dbClient){
                MongoClient.connect(Config.dbUrl,(err,client)=>{

                    if(err){
                        reject(err)

                    }else{

                        _that.dbClient=client.db(Config.dbName);
                        resolve(_that.dbClient)
                    }
                })

            }else{
                resolve(_that.dbClient);

            }


        })

    }
    find(collectionName,json){

        return new Promise((resolve,reject)=>{

            this.connect().then((db)=>{

                var result=db.collection(collectionName).find(json);

                result.toArray(function(err,docs){

                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })

            })
        })
    }
    update(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(json1,{
                    $set:json2
                },(err,result)=>{
                   if(err){
                       reject(err);
                   } else{
                       resolve(result);
                   }
                })
            })
        })

    }
    insert(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).insertOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{
                        resolve(result)
                    }

                })
            })
        })

    }
    remove(collectionName,json){
       return new Promise((resolve,reject)=>{
           this.connect().then((db)=>{
               db.collection(collectionName).removeOne(json,function(err,result){
                   if(err){
                       reject(err)
                   }else{
                       resolve(result)
                   }
               })
           })
       })
    }
}
module.exports=Db.getInstance();
