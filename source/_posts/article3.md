---
title: go 自定义http.Client
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/3.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/3.jpg
top: false
cover: false
toc: true
mathjax: false
summary: http.Client - 动态修改请求Body
tags: Golang
categories: Golang
abbrlink: 30351
date: 2021-10-04 16:06:30
password:
---

# 原理

go 中可以使用 http.DefaultClient 进行 http 请求，也可以自己创建 http.Client，传入自定义 Transport 可以实现对 request 的处理。

http.Client

    // A Client is an HTTP client. Its zero value (DefaultClient) is a
    // usable client that uses DefaultTransport.
    //
    // The Client's Transport typically has internal state (cached TCP
    // connections), so Clients should be reused instead of created as
    // needed. Clients are safe for concurrent use by multiple goroutines.
    //
    // A Client is higher-level than a RoundTripper (such as Transport)
    // and additionally handles HTTP details such as cookies and
    // redirects.
    //
    // When following redirects, the Client will forward all headers set on the
    // initial Request except:
    //
    // when forwarding sensitive headers like "Authorization",
    // "WWW-Authenticate", and "Cookie" to untrusted targets.
    // These headers will be ignored when following a redirect to a domain
    // that is not a subdomain match or exact match of the initial domain.
    // For example, a redirect from "foo.com" to either "foo.com" or "sub.foo.com"
    // will forward the sensitive headers, but a redirect to "bar.com" will not.
    //
    // • when forwarding the "Cookie" header with a non-nil cookie Jar.
    // Since each redirect may mutate the state of the cookie jar,
    // a redirect may possibly alter a cookie set in the initial request.
    // When forwarding the "Cookie" header, any mutated cookies will be omitted,
    // with the expectation that the Jar will insert those mutated cookies
    // with the updated values (assuming the origin matches).
    // If Jar is nil, the initial cookies are forwarded without change.

type Client struct

    // Transport specifies the mechanism by which individual
    // HTTP requests are made.
    // If nil, DefaultTransport is used.
    Transport RoundTripper
     // CheckRedirect specifies the policy for handling redirects.
     // If CheckRedirect is not nil, the client calls it before
     // following an HTTP redirect. The arguments req and via are
     // the upcoming request and the requests made already, oldest
     // first. If CheckRedirect returns an error, the Client's Get
     // method returns both the previous Response (with its Body
     // closed) and CheckRedirect's error (wrapped in a url.Error)
     // instead of issuing the Request req.
     // As a special case, if CheckRedirect returns ErrUseLastResponse,
     // then the most recent response is returned with its body
     // unclosed, along with a nil error.
     //
     // If CheckRedirect is nil, the Client uses its default policy,
     // which is to stop after 10 consecutive requests.
    CheckRedirect func(req *Request, via []*Request) error
     // Jar specifies the cookie jar.
     //
     // The Jar is used to insert relevant cookies into every
     // outbound Request and is updated with the cookie values
     // of every inbound Response. The Jar is consulted for every
     // redirect that the Client follows.``
     //
     // If Jar is nil, cookies are only sent if they are explicitly
     // set on the Request.
    Jar CookieJar
    // Timeout specifies a time limit for requests made by this
    // Client. The timeout includes connection time, any
    // redirects, and reading the response body. The timer remains
    // running after Get, Head, Post, or Do return and will
    // interrupt reading of the Response.Body.
    //
    // A Timeout of zero means no timeout.
    //
    // The Client cancels requests to the underlying Transport
    // as if the Request's Context ended.
    //
    // For compatibility, the Client will also use the deprecated
    // CancelRequest method on Transport if found. New
    // RoundTripper implementations should use the Request's Context
    // for cancellation instead of implementing CancelRequest.
    Timeout time.Duration}

http.RoundTripper

    // RoundTripper is an interface representing the ability to execute a
    // single HTTP transaction, obtaining the Response for a given Request.
    //
    // A RoundTripper must be safe for concurrent use by multiple
    // goroutines.
    type RoundTripper interface{
    // RoundTrip executes a single HTTP transaction, returning
    // a Response for the provided Request.
    //
    // RoundTrip should not attempt to interpret the response. In
    // particular, RoundTrip must return err == nil if it obtained
    // a response, regardless of the response's HTTP status code.
    // A non-nil err should be reserved for failure to obtain a
    // response. Similarly, RoundTrip should not attempt to
    // handle higher-level protocol details such as redirects,
    // authentication, or cookies.
    //
    // RoundTrip should not modify the request, except for
    // consuming and closing the Request's Body. RoundTrip may
    // read fields of the request in a separate goroutine. Callers
    // should not mutate or reuse the request until the Response's
    // Body has been closed.
    //
    // RoundTrip must always close the body, including on errors,
    // but depending on the implementation may do so in a separate
    // goroutine even after RoundTrip returns. This means that
    // callers wanting to reuse the body for subsequent requests
    // must arrange to wait for the Close call before doing so.
    //
    // The Request's URL and Header fields must be initialized.
    RoundTrip(*Request) (*Response, error)}

# 实现

先写一个 server，打印出访问的 payload 信息。

    package main
    import
    ("fmt" "io/ioutil" "net/http") func main() {
        mux := http.NewServeMux()
        mux.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
            req, err := ioutil.ReadAll(r.Body)
            if err != nil {
                rw.WriteHeader(500)
                rw.Write([]byte(err.Error()))
                return
            }
            fmt.Println(string(req))
        })
        if err := http.ListenAndServe(":8000", mux);
        err != nil {
            panic(err)
        }
    }


    如果使用默认的DefaultClient，只会打印出我们传入的payload。


    package main
    import
    ("fmt" "io/ioutil" "net/http" "strings" "github.com/google/uuid")
    func main() {
        id := uuid.NewString()
        req, _ := http.NewRequest("GET", "http://localhost:8000", strings.NewReader(fmt.Sprintf({"id":"%s"}, id)))
        req.Header.Add("Authorization", fmt.Sprintf("Bearer token%s", id))
        resp, err := http.DefaultClient.Do(req)
        if err != nil {
            panic(err)
        }
        fmt.Println(resp)
    }()

结果：

    {"id":"912733ce-4e17-4209-ad9e-71159fd37845"}
    &{200 OK 200 HTTP/1.1 1 1 map[Content-Length:[0] Date:[Sun, 28 Nov 2021 06:48:50 GMT]] {} 0 [] false false map[] 0xc000194000 <nil>}

使用自定义 Transport

    package main
    import
    ( "bytes"  "encoding/json" "io/ioutil" "net/http" "strings")
    type customTransport struct {

    }
    func (t *customTransport) RoundTrip(req *http.Request) (*http.Response, error) {
      token := req.Header.Get("Authorization")
      if len(token) != 0 &&  strings .HasPrefix(token,  "Bearer " ) {
        token = token[7:]
        var bodyBytes []byte
        if req.Body != nil {
          bodyBytes, _ = ioutil.ReadAll(req.Body)
          }
          var payload map[string]interface{}
          if err := json.Unmarshal(bodyBytes, &payload); err != nil {
            return nil, err
              }else{
                payload[``"token"``] = token
                if bodyBytes, err := json.Marshal(payload); err != nil {
                return nil, err
              }else{
              req.ContentLength = int64(len(bodyBytes))
              req.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))
          }
        }
      }
      resp, err := http.DefaultTransport.RoundTrip(req)
      if err != nil {
        return nil, err
      }
      return resp, nil
    }

使用自定义 Client

    package main
    import
    (  "fmt"  "io/ioutil"  "net/http"  "strings"   "github.com/google/uuid") func main() {
        id := uuid.NewString()  req, _ := http.NewRequest("GET", "http://localhost:8000", strings.NewReader(fmt.Sprintf({
            "id":"%s"
        }, id)))
        req.Header.Add("Authorization", fmt.Sprintf("Bearer token%s", id))
        client := &http.Client{
            Transport: &customTransport{},
        }
        resp, err := client.Do(req)
        if err != nil {
        panic(err)
      }
    fmt.Println(resp)
    }()

最终结果：

    {"id":"ebcceb4b-1979-457b-bf49-9255ceb77322","token":"tokenebcceb4b-1979-457b-bf49-9255ceb77322"}
    &{200 OK 200 HTTP/1.1 1 1 map[Content-Length:[0] Date:[Sun, 28 Nov 2021 06:49:25 GMT]] {} 0 [] false false map[] 0xc000140000 <nil>}
