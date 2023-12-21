import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Responsive from "../common/Responsive";

const PostViewerBlock = styled(Responsive)`
    margin-top: 4rem;
`;

const PostHead = styled.div`
    border-bottom: 1px solid ${palette.Gray[2]};
    padding-bottom: 3rem;
    margin-bottom: 3rem;
    h1{
        font-size: 3rem;
        line-height: 1.5;
        margin: 0;
    }
`;
const SubInfo=styled.div`
    margin-top: 1rem;
    color: ${palette.Gray[6]};
    
    /* span 사이에 가운뎃점 문자 보여 주기*/
    span + span: before {
    color: ${palette.Gray[5]};
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: '\\B7'; //가운뎃점 문자
}
`;

const Tags=styled.div`
    margin-top: 0.5rem;
    .tag{
        display: inline-block;
        color: ${palette.Cyan[7]};
        text-decoration: none;
        margin-right: 0.5rem;
        &:hover{
            color: ${palette.Cyan[6]};
        }
    }
`;

const PostContent = styled.div`
    font-size: 1.3125rem;
    color: ${palette.Gray[8]};
`;

const PostViewer = ({post, error, loading}) => {
    // 에러 발생 시
    if(error){
        if(error.response && error.response.status === 404){
            return<PostViewerBlock>존재하지 않는 포스트입니다.</PostViewerBlock>;
        }
        return<PostViewerBlock>오류 발생</PostViewerBlock>;
    }
    //로딩 중이거나 아직 포스트 데이터가 없을 때
    if(loading || !post){
        return null;
    }

    const {title, content, user, publishedDate, tags} = post;
    return(
        <PostViewerBlock>
            <PostHead>
                <h1>{title}</h1>
                <SubInfo>
                    <span>
                        <b>tester</b>
                    </span>
                    <span>{new Date(publishedDate).toLocaleDateString()}</span>
                </SubInfo>
                <Tags>
                    {tags.map(tag=>(
                        <div className='tag'>#{tag}</div>
                    ))}
                </Tags>
            </PostHead>
            <PostContent
                dangerouslySetInnerHTML={{__html: content}}
            />
        </PostViewerBlock>
    );
};

export default PostViewer;
