import postModel from '../../../../../models/post.model';
import userModel, {InterfaceModelUser} from '../../../../../models/user.model';
import jobModel from '../../../../../models/job.model';
import commentModel from '../../../../../models/comment.model';
import checkProxyService from './checkProxy.service';
import proxyModel from '../../../../../models/proxy.model';
import {NextFunction, Request, Response} from 'express';

export default async (request: Request, response: Response, next: NextFunction) => {
    await initJob(request, response, next);
}

async function initJob(request: Request, response: Response, next: NextFunction) {
    await runJobDaily(request, response, next);
}

async function runJobDaily(request: Request, response: Response, next: NextFunction) {
    const users = await userModel.find();

    try {
        for (const [i, user] of users.entries()) {
            console.log(i, user.username);
            // check proxy user
            await checkProxy(request, response, user);

            // job like-feed
            if (user.post_type.find(x => x === 'like-feed')) {
                const userFind = await jobModel.find({$and: [{"user._id": user._id}, {"status": 0}]});
                if (!userFind.length) {
                    await saveData(user, undefined, 'like-feed');
                } else {
                    const checked = userFind[0].jobs.find(x => x.type === 'like-feed');
                    if (!checked) {
                        const data = {
                            type: "like-feed"
                        };
                        userFind[0].jobs.push(data);
                        await userFind[0].save();
                    }
                }
            }

            // job comment-feed
            if (user.post_type.find(x => x === 'comment-feed')) {
                let comments;

                if (user.gender === undefined) {
                    comments = await commentModel.find();
                } else if (user.gender === 0 || user.gender === 1) {
                    comments = await commentModel.find({gender: user.gender});
                    if (!comments.length) {
                        comments = await commentModel.find({gender: undefined});
                    }
                } else {
                    comments = await commentModel.find();
                }

                if (comments.length) {
                    // Random comments
                    const item = comments[Math.floor(Math.random() * comments.length)];
                    const userFind = await jobModel.find({$and: [{"user._id": user._id}, {"status": 0}]});

                    let random;
                    if (item.comments.length > 5) {
                        random = item.comments.sort(() => .5 - Math.random()).slice(0, 5);
                    } else {
                        random = item.comments;
                    }

                    if (!userFind.length) {
                        await saveData(user, random, 'comment-feed');
                    } else {
                        const checked = userFind[0].jobs.find(x => x.type === 'comment-feed');
                        if (!checked) {
                            const data = {
                                data: random,
                                type: "comment-feed"
                            };
                            userFind[0].jobs.push(data);
                            await userFind[0].save();
                        }
                    }
                }
            }

            // job post
            if (user.post_type.find(x => x === 'post')) {
                let posts;

                if (user.gender === undefined) {
                    posts = await postModel.find();
                } else if (user.gender === 0 || user.gender === 1) {
                    posts = await postModel.find({gender: user.gender});
                    if (!posts.length) {
                        posts = await postModel.find({gender: undefined});
                    }
                } else {
                    posts = await postModel.find();
                }

                if (posts.length) {
                    // Random posts
                    let item;
                    const userFind = await jobModel.find({$and: [{"user._id": user._id}, {"status": 0}]});
                    let loop = true;

                    do {
                        item = posts[Math.floor(Math.random() * posts.length)];
                        if (item.image) {
                            loop = false;
                        }
                    } while (loop);

                    if (!userFind.length) {
                        if (item.status === 0) {
                            item.status = 1;
                            const savePost = new postModel(item);
                            await savePost.save();
                        }
                        await saveData(user, item, 'post');
                    } else {
                        const checked = userFind[0].jobs.find(x => x.type === 'post');
                        if (!checked) {
                            const data = {
                                data: item,
                                type: "post"
                            };
                            userFind[0].jobs.push(data);
                            if (item.status === 0) {
                                item.status = 1;
                                const savePost = new postModel(item);
                                await savePost.save();
                            }
                            await userFind[0].save();
                        }
                    }
                }
            }
        }
        response.send({success: true});
    } catch (e) {
        next(e);
    }
}

async function checkProxy(request: Request, response: Response, data: InterfaceModelUser) {
    let loop = true;
    do {
        const user = await userModel.findOne({username: data.username});

        console.log("Start check");
        const check = await checkProxyService(user.proxy.address);
        if (check) {
            loop = false;
        } else {
            // change proxy user
            const proxies = await proxyModel.find({status: 1, used: 0});
            if (proxies.length) {
                const item = proxies[Math.floor(Math.random() * proxies.length)];
                item.used = 1;
                user.proxy = item;
                user.updated_at = new Date();
                user.save();
            } else {
                loop = false;
                response.status(400).send({message: "Proxy die all"});
            }
        }
        console.log("End check");

    } while (loop);
}

async function saveData(user: any, dataSave: any, type: any) {
    const date = new Date();
    const data = {
        user,
        jobs: [
            {
                data: dataSave,
                type
            }
        ],
        status: 0,
        start_date: date.setDate(date.getDate() + 1),
        created_at: new Date()
    };
    const job = new jobModel(data);

    await job.save();
}




