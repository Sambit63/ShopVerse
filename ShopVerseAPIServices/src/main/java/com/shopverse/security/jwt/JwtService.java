package com.shopverse.security.jwt;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // Base64 encoded secret key (must be at least 256 bits)
    private static final String SECRET_KEY =
            "VGhpc0lzQVNlY3JldEtleUZvclNob3BWZXJzZUpXVFRva2VuMTIzNDU2Nzg5";

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);
        return key;
    }

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {

        Claims claims = Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public boolean isTokenValid(String token, String email) {

        return extractUsername(token).equals(email);
    }
}